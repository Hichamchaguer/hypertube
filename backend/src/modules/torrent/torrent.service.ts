import axios from 'axios';
import * as fs from 'fs';
import { dirname, extname, join } from 'path';
import torrentStream = require('torrent-stream');
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import pump from 'pump';
import parseTorrent from 'parse-torrent';
import { scrapTorrentLinks, TorrentCandidate } from './helpers/scrapTorrentLinks';
import Video from '../../database/models/video';
import Torrent from '../../database/models/torrent';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface StreamResponse {
  success: boolean;
  movieId: string;
  hlsUrl: string | null;
  message: string;
}

interface TorrentMeta extends TorrentCandidate {
  downloadStatus: 'not_started' | 'downloading' | 'completed';
  hlsPlaylistPath: string | null;
  lastWatched: Date | null;
  _id?: string;
}

const createTmdbClient = () => {
  const baseURL = process.env.TMDB_BASE_URL;
  const apiKey = process.env.TMDB_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error('TMDB_BASE_URL or TMDB_API_KEY is not defined in environment');
  }

  return axios.create({
    baseURL,
    params: {
      api_key: apiKey,
    },
  });
};

const isImdbId = (movieId: string) => /^tt\d+$/i.test(movieId);

const resolveMovieIds = async (movieId: string) => {
  const tmdb = createTmdbClient();
  if (isImdbId(movieId)) {
    const response = await tmdb.get(`/find/${movieId}`, {
      params: {
        external_source: 'imdb_id',
      },
    });

    const result = response.data?.movie_results?.[0];
    if (!result?.id) {
      throw new Error('TMDB movie not found for IMDb id');
    }

    return {
      tmdbId: String(result.id),
      imdbId: movieId,
    };
  }

  return {
    tmdbId: movieId,
    imdbId: null as string | null,
  };
};

const getMovieInfo = async (movieId: string) => {
  const tmdb = createTmdbClient();
  const { tmdbId, imdbId } = await resolveMovieIds(movieId);
  const response = await tmdb.get(`/movie/${tmdbId}`, {
    params: {
      append_to_response: 'external_ids',
    },
  });
  const movie = response.data;
  return {
    tmdbId,
    imdbId: movie.external_ids?.imdb_id || imdbId,
    title: movie.title,
    year: parseInt(movie.release_date?.split('-')[0] || '0', 10),
  };
};

const getOrCreateTorrents = async (movieId: string) => {
  const movieInfo = await getMovieInfo(movieId);

  let video = await Video.findOne({ tmdbId: Number(movieInfo.tmdbId) });
  if (!video) {
    video = await Video.create({
      tmdbId: Number(movieInfo.tmdbId),
      imdbId: movieInfo.imdbId || undefined,
      title: movieInfo.title,
      year: String(movieInfo.year || ''),
      watched: false,
    });
  } else if (!video.imdbId && movieInfo.imdbId) {
    video.imdbId = movieInfo.imdbId;
    await video.save();
  }

  const existingTorrents = await Torrent.find({ movie_id: video._id });
  if (existingTorrents.length) {
    return existingTorrents.map((torrent) => ({
      _id: torrent._id.toString(),
      magnetLink: torrent.magnetLink,
      quality: torrent.quality,
      size: torrent.size ?? 'Unknown',
      seeders: torrent.seeders,
      leechers: torrent.leechers,
      downloadStatus: torrent.downloadStatus,
      hlsPlaylistPath: torrent.hlsPlaylistPath ?? null,
      lastWatched: torrent.lastWatched ?? null,
    }));
  }

  const candidates = await scrapTorrentLinks(movieInfo.title, movieInfo.year);
  const torrents: TorrentMeta[] = candidates.map((torrent) => ({
    ...torrent,
    downloadStatus: 'not_started',
    hlsPlaylistPath: null,
    lastWatched: null,
  }));

  const created = await Torrent.insertMany(
    torrents.map((torrent) => ({
      movie_id: video._id,
      quality: torrent.quality,
      magnetLink: torrent.magnetLink,
      size: torrent.size,
      seeders: torrent.seeders,
      leechers: torrent.leechers,
      downloadStatus: torrent.downloadStatus,
      hlsPlaylistPath: torrent.hlsPlaylistPath,
      lastWatched: torrent.lastWatched,
    })),
  );

  video.torrents = created.map((torrent) => torrent._id);
  await video.save();

  return created.map((torrent) => ({
    _id: torrent._id.toString(),
    magnetLink: torrent.magnetLink,
    quality: torrent.quality,
    size: torrent.size ?? 'Unknown',
    seeders: torrent.seeders,
    leechers: torrent.leechers,
    downloadStatus: torrent.downloadStatus,
    hlsPlaylistPath: torrent.hlsPlaylistPath ?? null,
    lastWatched: torrent.lastWatched ?? null,
  }));
};

const cleanTrackers = async (info: any) => {
  const sanitizer = (url: string) => url.replace(/[\u200B\s]/g, '');
  if (info.announce) {
    info.announce = info.announce.map(sanitizer);
  }
  if (info.announceList) {
    info.announceList = info.announceList.map((list: string[]) =>
      list.map(sanitizer),
    );
  }
  return info;
};

const getFFmpegMkvConversionCommand = (
  videoStream: fs.ReadStream,
  segmentPattern: string,
  playlistPath: string,
) => {
  return ffmpeg(videoStream)
    .videoCodec('libx264')
    .addOptions([
      '-profile:v baseline',
      '-level 3.0',
      '-pix_fmt yuv420p',
      '-preset veryfast',
      '-r 24',
    ])
    .audioCodec('aac')
    .addOptions(['-ac 2', '-ar 48000', '-b:a 128k'])
    .addOptions([
      '-f hls',
      '-hls_time 4',
      '-hls_list_size 0',
      '-hls_segment_filename',
      segmentPattern,
    ])
    .output(playlistPath);
};

export const createStream = async (
  movieId: string,
  quality: string,
): Promise<StreamResponse> => {
  const torrents = await getOrCreateTorrents(movieId);
  const torrent = torrents.find((item) => item.quality === quality);

  if (!torrent) {
    return {
      success: false,
      movieId,
      hlsUrl: null,
      message: 'No torrent found for that quality.',
    };
  }

  if (torrent.downloadStatus === 'completed' && torrent.hlsPlaylistPath) {
    torrent.lastWatched = new Date();
    if (torrent._id) {
      await Torrent.findByIdAndUpdate(torrent._id, {
        lastWatched: torrent.lastWatched,
      });
    }
    return {
      success: true,
      movieId,
      hlsUrl: torrent.hlsPlaylistPath,
      message: 'Stream already available',
    };
  }

  const { torrentFile } = await createTorrentEngine(movieId, torrent);
  const hlsDir = join('hls', movieId, quality);

  const playlistPath =
    torrent.downloadStatus === 'not_started'
      ? await startHlsConversion(torrent, torrentFile, hlsDir, movieId)
      : torrent.hlsPlaylistPath || join(hlsDir, 'playlist.m3u8');

  torrent.hlsPlaylistPath = playlistPath;
  torrent.lastWatched = new Date();
  if (torrent._id) {
    await Torrent.findByIdAndUpdate(torrent._id, {
      hlsPlaylistPath: torrent.hlsPlaylistPath,
      lastWatched: torrent.lastWatched,
      downloadStatus: torrent.downloadStatus,
    });
  }

  await new Promise((resolve, reject) => {
    let timeout: NodeJS.Timeout;
    const interval = setInterval(async () => {
      try {
        await fs.promises.access(join(process.cwd(), playlistPath));
        clearInterval(interval);
        if (timeout) clearTimeout(timeout);
        resolve(true);
      } catch {
        return;
      }
    }, 1000);

    timeout = setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Timeout waiting for playlist creation'));
    }, 45000);
  });

  return {
    success: true,
    movieId,
    hlsUrl: playlistPath,
    message: 'Stream started successfully',
  };
};

const createTorrentEngine = async (
  movieId: string,
  torrent: TorrentMeta,
): Promise<{ torrentFile: any }> => {
  const magnetUrl = torrent.magnetLink;
  if (!magnetUrl) {
    throw new Error('No magnet link found');
  }

  if (torrent.downloadStatus === 'completed') {
    return { torrentFile: null as any };
  }

  let torrentSource: any = magnetUrl;
  if (!magnetUrl.startsWith('magnet:')) {
    const response = await axios.get(magnetUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
  let info = parseTorrent(buffer) as unknown;
  info = await cleanTrackers(info as any);
  torrentSource = parseTorrent.toTorrentFile(info as any);
  }

  return new Promise((resolve, reject) => {
    const engine = torrentStream(torrentSource, {
      path: join('/tmp/torrents', movieId, torrent.quality),
    });

    engine.on('ready', async () => {
  engine.files.forEach((file: any) => file.deselect());
  const desiredFile = engine.files.find((file: any) =>
        /\.(mp4|mkv|avi|mov|wmv|flv|webm|mpg|mpeg|m4v|3gp|3g2|ts|vob|ogv|rm|rmvb|asf|f4v)$/i.test(
          file.name,
        ),
      );
      if (!desiredFile) {
        return reject(new Error('No suitable video file found in torrent.'));
      }
      desiredFile.select();
      desiredFile.createReadStream();

      engine.on('download', async () => {
        if (torrent.downloadStatus === 'not_started') {
          torrent.downloadStatus = 'downloading';
          if (torrent._id) {
            await Torrent.findByIdAndUpdate(torrent._id, {
              downloadStatus: torrent.downloadStatus,
            });
          }
        }
      });

      engine.on('idle', async () => {
        torrent.downloadStatus = 'completed';
        if (torrent._id) {
          await Torrent.findByIdAndUpdate(torrent._id, {
            downloadStatus: torrent.downloadStatus,
          });
        }
      });

      resolve({ torrentFile: desiredFile });
    });

    engine.on('error', (err: Error) => {
      reject(err);
    });
  });
};

const startHlsConversion = async (
  torrent: TorrentMeta,
  videoFile: any,
  hlsDir: string,
  movieId: string,
) => {
  return new Promise<string>(async (resolve, reject) => {
    const hlsFullDir = join(process.cwd(), hlsDir);
    try {
      await fs.promises.mkdir(hlsFullDir, { recursive: true });
    } catch (err) {
      return reject(err);
    }

  const playlistPath = join(hlsFullDir, 'playlist.m3u8');
  const playlistRelativePath = join(hlsDir, 'playlist.m3u8');
    const segmentPattern = join(hlsFullDir, 'segment_%03d.ts');

    const videoStream = videoFile.createReadStream();
    const fileExtension = extname(videoFile.name);
    let ffmpegCommand: ffmpeg.FfmpegCommand;

    if (fileExtension === '.mp4') {
      ffmpegCommand = ffmpeg(videoStream)
        .addOptions([
          '-c copy',
          '-f hls',
          '-hls_time 4',
          '-hls_list_size 0',
          '-hls_flags independent_segments',
          '-hls_segment_filename',
          segmentPattern,
        ])
        .output(playlistPath);
    } else {
      ffmpegCommand = getFFmpegMkvConversionCommand(
        videoStream,
        segmentPattern,
        playlistPath,
      );
    }

    ffmpegCommand.on('start', async () => {
      torrent.downloadStatus = 'downloading';
      if (torrent._id) {
        await Torrent.findByIdAndUpdate(torrent._id, {
          downloadStatus: torrent.downloadStatus,
        });
      }
    });

    ffmpegCommand.on('progress', () => {
  resolve(playlistRelativePath);
    });

    ffmpegCommand.on('end', async () => {
      torrent.downloadStatus = 'completed';
      if (torrent._id) {
        await Torrent.findByIdAndUpdate(torrent._id, {
          downloadStatus: torrent.downloadStatus,
        });
      }
    });

    ffmpegCommand.on('error', async (err: Error) => {
      await fs.promises.rm(hlsFullDir, { recursive: true, force: true });
      torrent.hlsPlaylistPath = null;
      torrent.downloadStatus = 'not_started';
      if (torrent._id) {
        await Torrent.findByIdAndUpdate(torrent._id, {
          hlsPlaylistPath: torrent.hlsPlaylistPath,
          downloadStatus: torrent.downloadStatus,
        });
      }
      reject(err);
    });

    ffmpegCommand.run();
  });
};

export const getStreamPlaylist = async (movieId: string, quality: string) => {
  const torrents = await getOrCreateTorrents(movieId);
  const torrent = torrents.find((item) => item.quality === quality);
  if (!torrent || !torrent.hlsPlaylistPath) {
    throw new Error('M3U8 file not found');
  }

  const playlistPath = torrent.hlsPlaylistPath
    ? join(process.cwd(), torrent.hlsPlaylistPath)
    : join(process.cwd(), 'hls', movieId, quality, 'playlist.m3u8');
  await fs.promises.access(playlistPath, fs.constants.F_OK);
  return playlistPath;
};

export const getSegmentPath = async (
  movieId: string,
  quality: string,
  segment: string,
) => {
  if (!segment.match(/^segment_\d+\.ts$/)) {
    throw new Error('Invalid segment format');
  }

  const torrents = await getOrCreateTorrents(movieId);
  const torrent = torrents.find((item) => item.quality === quality);
  if (!torrent || !torrent.hlsPlaylistPath) {
    throw new Error('Segment file not found');
  }

  const segmentBase = dirname(torrent.hlsPlaylistPath);
  const segmentPath = join(process.cwd(), segmentBase, segment);

  await fs.promises.access(segmentPath, fs.constants.F_OK);
  return segmentPath;
};

export const getAvailableQualities = async (movieId: string) => {
  const torrents = await getOrCreateTorrents(movieId);
  return torrents
    .map((torrent) => torrent.quality)
    .sort(
      (first, second) =>
        parseInt(second.replace('p', ''), 10) -
        parseInt(first.replace('p', ''), 10),
    )
    .reverse()
    .filter((quality, index, self) => self.indexOf(quality) === index);
};

export const streamFile = (filePath: string, res: any) => {
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', (error) => {
    res.status(500).json({
      error: 'Failed to stream file',
      message: error.message,
    });
  });
  pump(fileStream, res);
};
