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
import { fetchMovieDetailsById } from '../movies/movies.service';

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

const buildVideoPayload = (movieInfo: any) => ({
  tmdbId: Number(movieInfo.tmdbId ?? movieInfo.id),
  imdbId: movieInfo.imdbId || undefined,
  title: movieInfo.title,
  year: movieInfo.year || '',
  duration: movieInfo.runtime || 0,
  rating: movieInfo.rating ?? 0,
  genres: movieInfo.genres || [],
  synopsis: movieInfo.synopsis || '',
  poster: movieInfo.poster || null,
  backdrop: movieInfo.backdrop || null,
  directors: movieInfo.directors || [],
  actors: movieInfo.actors || [],
  trailer: movieInfo.trailer || null,
});

const getMovieInfo = async (movieId: string) => {
  const movieDetails = await fetchMovieDetailsById(movieId);
  return {
    tmdbId: movieDetails.tmdbId ?? String(movieDetails.id),
    imdbId: movieDetails.imdbId,
    title: movieDetails.title,
    year: parseInt(movieDetails.year || '0', 10),
    details: movieDetails,
  };
};

const getOrCreateTorrents = async (movieId: string) => {
  const movieInfo = await getMovieInfo(movieId);
  const payload = buildVideoPayload(movieInfo.details);

  let video = await Video.findOne({ tmdbId: Number(movieInfo.tmdbId) });
  if (!video) {
    video = await Video.create({
      ...payload,
      watched: false,
    });
  } else {
    const shouldUpdate =
      (!video.imdbId && payload.imdbId) ||
      !video.synopsis ||
      !video.poster ||
      !video.backdrop ||
      !video.genres?.length ||
      !video.directors?.length ||
      !video.actors?.length ||
      !video.trailer ||
      !video.duration ||
      !video.rating;

    if (shouldUpdate) {
      Object.assign(video, payload);
      await video.save();
    }
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

  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      try {
        await fs.promises.access(join(process.cwd(), playlistPath));
        clearInterval(interval);
        resolve(true);
      } catch {
        return;
      }
    }, 1000);
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

// const startHlsConversion = async (
//   torrent: TorrentMeta,
//   videoFile: any,
//   hlsDir: string,
//   movieId: string,
// ) => {
//   return new Promise<string>(async (resolve, reject) => {
//     const hlsFullDir = join(process.cwd(), hlsDir);
//     try {
//       await fs.promises.mkdir(hlsFullDir, { recursive: true });
//     } catch (err) {
//       return reject(err);
//     }

//   const playlistPath = join(hlsFullDir, 'playlist.m3u8');
//   const playlistRelativePath = join(hlsDir, 'playlist.m3u8');
//     const segmentPattern = join(hlsFullDir, 'segment_%03d.ts');

//     const videoStream = videoFile.createReadStream();
//     const fileExtension = extname(videoFile.name);
//     let ffmpegCommand: ffmpeg.FfmpegCommand;

//     if (fileExtension === '.mp4') {
//       ffmpegCommand = ffmpeg(videoStream)
//         .addOptions([
//           '-c copy',
//           '-f hls',
//           '-hls_time 4',
//           '-hls_list_size 0',
//           '-hls_flags independent_segments',
//           '-hls_segment_filename',
//           segmentPattern,
//         ])
//         .output(playlistPath);
//     } else {
//       ffmpegCommand = getFFmpegMkvConversionCommand(
//         videoStream,
//         segmentPattern,
//         playlistPath,
//       );
//     }

//     ffmpegCommand.on('start', async () => {
//       torrent.downloadStatus = 'downloading';
//       if (torrent._id) {
//         await Torrent.findByIdAndUpdate(torrent._id, {
//           downloadStatus: torrent.downloadStatus,
//         });
//       }
//     });

//     ffmpegCommand.on('progress', () => {
//   resolve(playlistRelativePath);
//     });

//     ffmpegCommand.on('end', async () => {
//       torrent.downloadStatus = 'completed';
//       if (torrent._id) {
//         await Torrent.findByIdAndUpdate(torrent._id, {
//           downloadStatus: torrent.downloadStatus,
//         });
//       }
//     });

//     ffmpegCommand.on('error', async (err: Error) => {
//       await fs.promises.rm(hlsFullDir, { recursive: true, force: true });
//       torrent.hlsPlaylistPath = null;
//       torrent.downloadStatus = 'not_started';
//       if (torrent._id) {
//         await Torrent.findByIdAndUpdate(torrent._id, {
//           hlsPlaylistPath: torrent.hlsPlaylistPath,
//           downloadStatus: torrent.downloadStatus,
//         });
//       }
//       reject(err);
//     });

//     ffmpegCommand.run();
//   });
// };

// Replace the startHlsConversion function in torrent.service.ts

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
    
    let isResolved = false; // Track if we've already resolved

    if (fileExtension === '.mp4') {
      ffmpegCommand = ffmpeg(videoStream)
        .addOptions([
          '-c copy',
          '-f hls',
          '-hls_time 4',
          '-hls_list_size 0',  // Keep all segments in playlist
          '-hls_flags independent_segments+program_date_time',
          '-hls_segment_type mpegts',
          '-hls_playlist_type vod',  // Change from 'event' to 'vod' if you know total duration
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

    ffmpegCommand.on('progress', (progress) => {
      console.log(`FFmpeg progress: ${progress.percent}% done`);
      
      // Only resolve after we have at least 10 segments (40 seconds) OR 5% of expected duration
      // But don't resolve immediately at first progress event
      if (!isResolved && progress.percent && progress.percent > 5) {
        isResolved = true;
        console.log(`Resolving playlist after ${progress.percent}% conversion`);
        resolve(playlistRelativePath);
      }
    });

    ffmpegCommand.on('end', async () => {
      console.log('FFmpeg conversion completed');
      torrent.downloadStatus = 'completed';
      if (torrent._id) {
        await Torrent.findByIdAndUpdate(torrent._id, {
          downloadStatus: torrent.downloadStatus,
        });
      }
      
      // If we haven't resolved yet (e.g., if conversion was very fast), resolve now
      if (!isResolved) {
        isResolved = true;
        resolve(playlistRelativePath);
      }
    });

    ffmpegCommand.on('error', async (err: Error) => {
      console.error('FFmpeg error:', err);
      await fs.promises.rm(hlsFullDir, { recursive: true, force: true });
      torrent.hlsPlaylistPath = null;
      torrent.downloadStatus = 'not_started';
      if (torrent._id) {
        await Torrent.findByIdAndUpdate(torrent._id, {
          hlsPlaylistPath: torrent.hlsPlaylistPath,
          downloadStatus: torrent.downloadStatus,
        });
      }
      if (!isResolved) {
        isResolved = true;
        reject(err);
      }
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
