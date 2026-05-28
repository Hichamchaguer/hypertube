"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamFile = exports.getAvailableQualities = exports.getSegmentPath = exports.getStreamPlaylist = exports.createStream = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path_1 = require("path");
const torrentStream = require("torrent-stream");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
const pump_1 = __importDefault(require("pump"));
const parse_torrent_1 = __importDefault(require("parse-torrent"));
const scrapTorrentLinks_1 = require("./helpers/scrapTorrentLinks");
const video_1 = __importDefault(require("../../database/models/video"));
const torrent_1 = __importDefault(require("../../database/models/torrent"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
const createTmdbClient = () => {
    const baseURL = process.env.TMDB_BASE_URL;
    const apiKey = process.env.TMDB_API_KEY;
    if (!baseURL || !apiKey) {
        throw new Error('TMDB_BASE_URL or TMDB_API_KEY is not defined in environment');
    }
    return axios_1.default.create({
        baseURL,
        params: {
            api_key: apiKey,
        },
    });
};
const isImdbId = (movieId) => /^tt\d+$/i.test(movieId);
const resolveMovieIds = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const tmdb = createTmdbClient();
    if (isImdbId(movieId)) {
        const response = yield tmdb.get(`/find/${movieId}`, {
            params: {
                external_source: 'imdb_id',
            },
        });
        const result = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.movie_results) === null || _b === void 0 ? void 0 : _b[0];
        if (!(result === null || result === void 0 ? void 0 : result.id)) {
            throw new Error('TMDB movie not found for IMDb id');
        }
        return {
            tmdbId: String(result.id),
            imdbId: movieId,
        };
    }
    return {
        tmdbId: movieId,
        imdbId: null,
    };
});
const getMovieInfo = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const tmdb = createTmdbClient();
    const { tmdbId, imdbId } = yield resolveMovieIds(movieId);
    const response = yield tmdb.get(`/movie/${tmdbId}`, {
        params: {
            append_to_response: 'external_ids',
        },
    });
    const movie = response.data;
    return {
        tmdbId,
        imdbId: ((_a = movie.external_ids) === null || _a === void 0 ? void 0 : _a.imdb_id) || imdbId,
        title: movie.title,
        year: parseInt(((_b = movie.release_date) === null || _b === void 0 ? void 0 : _b.split('-')[0]) || '0', 10),
    };
});
const getOrCreateTorrents = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    const movieInfo = yield getMovieInfo(movieId);
    let video = yield video_1.default.findOne({ tmdbId: Number(movieInfo.tmdbId) });
    if (!video) {
        video = yield video_1.default.create({
            tmdbId: Number(movieInfo.tmdbId),
            imdbId: movieInfo.imdbId || undefined,
            title: movieInfo.title,
            year: String(movieInfo.year || ''),
            watched: false,
        });
    }
    else if (!video.imdbId && movieInfo.imdbId) {
        video.imdbId = movieInfo.imdbId;
        yield video.save();
    }
    const existingTorrents = yield torrent_1.default.find({ movie_id: video._id });
    if (existingTorrents.length) {
        return existingTorrents.map((torrent) => {
            var _a, _b, _c;
            return ({
                _id: torrent._id.toString(),
                magnetLink: torrent.magnetLink,
                quality: torrent.quality,
                size: (_a = torrent.size) !== null && _a !== void 0 ? _a : 'Unknown',
                seeders: torrent.seeders,
                leechers: torrent.leechers,
                downloadStatus: torrent.downloadStatus,
                hlsPlaylistPath: (_b = torrent.hlsPlaylistPath) !== null && _b !== void 0 ? _b : null,
                lastWatched: (_c = torrent.lastWatched) !== null && _c !== void 0 ? _c : null,
            });
        });
    }
    const candidates = yield (0, scrapTorrentLinks_1.scrapTorrentLinks)(movieInfo.title, movieInfo.year);
    const torrents = candidates.map((torrent) => (Object.assign(Object.assign({}, torrent), { downloadStatus: 'not_started', hlsPlaylistPath: null, lastWatched: null })));
    const created = yield torrent_1.default.insertMany(torrents.map((torrent) => ({
        movie_id: video._id,
        quality: torrent.quality,
        magnetLink: torrent.magnetLink,
        size: torrent.size,
        seeders: torrent.seeders,
        leechers: torrent.leechers,
        downloadStatus: torrent.downloadStatus,
        hlsPlaylistPath: torrent.hlsPlaylistPath,
        lastWatched: torrent.lastWatched,
    })));
    video.torrents = created.map((torrent) => torrent._id);
    yield video.save();
    return created.map((torrent) => {
        var _a, _b, _c;
        return ({
            _id: torrent._id.toString(),
            magnetLink: torrent.magnetLink,
            quality: torrent.quality,
            size: (_a = torrent.size) !== null && _a !== void 0 ? _a : 'Unknown',
            seeders: torrent.seeders,
            leechers: torrent.leechers,
            downloadStatus: torrent.downloadStatus,
            hlsPlaylistPath: (_b = torrent.hlsPlaylistPath) !== null && _b !== void 0 ? _b : null,
            lastWatched: (_c = torrent.lastWatched) !== null && _c !== void 0 ? _c : null,
        });
    });
});
const cleanTrackers = (info) => __awaiter(void 0, void 0, void 0, function* () {
    const sanitizer = (url) => url.replace(/[\u200B\s]/g, '');
    if (info.announce) {
        info.announce = info.announce.map(sanitizer);
    }
    if (info.announceList) {
        info.announceList = info.announceList.map((list) => list.map(sanitizer));
    }
    return info;
});
const getFFmpegMkvConversionCommand = (videoStream, segmentPattern, playlistPath) => {
    return (0, fluent_ffmpeg_1.default)(videoStream)
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
const createStream = (movieId, quality) => __awaiter(void 0, void 0, void 0, function* () {
    const torrents = yield getOrCreateTorrents(movieId);
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
            yield torrent_1.default.findByIdAndUpdate(torrent._id, {
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
    const { torrentFile } = yield createTorrentEngine(movieId, torrent);
    const hlsDir = (0, path_1.join)('hls', movieId, quality);
    const playlistPath = torrent.downloadStatus === 'not_started'
        ? yield startHlsConversion(torrent, torrentFile, hlsDir, movieId)
        : torrent.hlsPlaylistPath || (0, path_1.join)(hlsDir, 'playlist.m3u8');
    torrent.hlsPlaylistPath = playlistPath;
    torrent.lastWatched = new Date();
    if (torrent._id) {
        yield torrent_1.default.findByIdAndUpdate(torrent._id, {
            hlsPlaylistPath: torrent.hlsPlaylistPath,
            lastWatched: torrent.lastWatched,
            downloadStatus: torrent.downloadStatus,
        });
    }
    yield new Promise((resolve) => {
        const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield fs.promises.access((0, path_1.join)(process.cwd(), playlistPath));
                clearInterval(interval);
                resolve(true);
            }
            catch (_a) {
                return;
            }
        }), 1000);
    });
    return {
        success: true,
        movieId,
        hlsUrl: playlistPath,
        message: 'Stream started successfully',
    };
});
exports.createStream = createStream;
const createTorrentEngine = (movieId, torrent) => __awaiter(void 0, void 0, void 0, function* () {
    const magnetUrl = torrent.magnetLink;
    if (!magnetUrl) {
        throw new Error('No magnet link found');
    }
    if (torrent.downloadStatus === 'completed') {
        return { torrentFile: null };
    }
    let torrentSource = magnetUrl;
    if (!magnetUrl.startsWith('magnet:')) {
        const response = yield axios_1.default.get(magnetUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        let info = (0, parse_torrent_1.default)(buffer);
        info = yield cleanTrackers(info);
        torrentSource = parse_torrent_1.default.toTorrentFile(info);
    }
    return new Promise((resolve, reject) => {
        const engine = torrentStream(torrentSource, {
            path: (0, path_1.join)('/tmp/torrents', movieId, torrent.quality),
        });
        engine.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
            engine.files.forEach((file) => file.deselect());
            const desiredFile = engine.files.find((file) => /\.(mp4|mkv|avi|mov|wmv|flv|webm|mpg|mpeg|m4v|3gp|3g2|ts|vob|ogv|rm|rmvb|asf|f4v)$/i.test(file.name));
            if (!desiredFile) {
                return reject(new Error('No suitable video file found in torrent.'));
            }
            desiredFile.select();
            desiredFile.createReadStream();
            engine.on('download', () => __awaiter(void 0, void 0, void 0, function* () {
                if (torrent.downloadStatus === 'not_started') {
                    torrent.downloadStatus = 'downloading';
                    if (torrent._id) {
                        yield torrent_1.default.findByIdAndUpdate(torrent._id, {
                            downloadStatus: torrent.downloadStatus,
                        });
                    }
                }
            }));
            engine.on('idle', () => __awaiter(void 0, void 0, void 0, function* () {
                torrent.downloadStatus = 'completed';
                if (torrent._id) {
                    yield torrent_1.default.findByIdAndUpdate(torrent._id, {
                        downloadStatus: torrent.downloadStatus,
                    });
                }
            }));
            resolve({ torrentFile: desiredFile });
        }));
        engine.on('error', (err) => {
            reject(err);
        });
    });
});
const startHlsConversion = (torrent, videoFile, hlsDir, movieId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const hlsFullDir = (0, path_1.join)(process.cwd(), hlsDir);
        try {
            yield fs.promises.mkdir(hlsFullDir, { recursive: true });
        }
        catch (err) {
            return reject(err);
        }
        const playlistPath = (0, path_1.join)(hlsFullDir, 'playlist.m3u8');
        const playlistRelativePath = (0, path_1.join)(hlsDir, 'playlist.m3u8');
        const segmentPattern = (0, path_1.join)(hlsFullDir, 'segment_%03d.ts');
        const videoStream = videoFile.createReadStream();
        const fileExtension = (0, path_1.extname)(videoFile.name);
        let ffmpegCommand;
        if (fileExtension === '.mp4') {
            ffmpegCommand = (0, fluent_ffmpeg_1.default)(videoStream)
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
        }
        else {
            ffmpegCommand = getFFmpegMkvConversionCommand(videoStream, segmentPattern, playlistPath);
        }
        ffmpegCommand.on('start', () => __awaiter(void 0, void 0, void 0, function* () {
            torrent.downloadStatus = 'downloading';
            if (torrent._id) {
                yield torrent_1.default.findByIdAndUpdate(torrent._id, {
                    downloadStatus: torrent.downloadStatus,
                });
            }
        }));
        ffmpegCommand.on('progress', () => {
            resolve(playlistRelativePath);
        });
        ffmpegCommand.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            torrent.downloadStatus = 'completed';
            if (torrent._id) {
                yield torrent_1.default.findByIdAndUpdate(torrent._id, {
                    downloadStatus: torrent.downloadStatus,
                });
            }
        }));
        ffmpegCommand.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
            yield fs.promises.rm(hlsFullDir, { recursive: true, force: true });
            torrent.hlsPlaylistPath = null;
            torrent.downloadStatus = 'not_started';
            if (torrent._id) {
                yield torrent_1.default.findByIdAndUpdate(torrent._id, {
                    hlsPlaylistPath: torrent.hlsPlaylistPath,
                    downloadStatus: torrent.downloadStatus,
                });
            }
            reject(err);
        }));
        ffmpegCommand.run();
    }));
});
const getStreamPlaylist = (movieId, quality) => __awaiter(void 0, void 0, void 0, function* () {
    const torrents = yield getOrCreateTorrents(movieId);
    const torrent = torrents.find((item) => item.quality === quality);
    if (!torrent || !torrent.hlsPlaylistPath) {
        throw new Error('M3U8 file not found');
    }
    const playlistPath = torrent.hlsPlaylistPath
        ? (0, path_1.join)(process.cwd(), torrent.hlsPlaylistPath)
        : (0, path_1.join)(process.cwd(), 'hls', movieId, quality, 'playlist.m3u8');
    yield fs.promises.access(playlistPath, fs.constants.F_OK);
    return playlistPath;
});
exports.getStreamPlaylist = getStreamPlaylist;
const getSegmentPath = (movieId, quality, segment) => __awaiter(void 0, void 0, void 0, function* () {
    if (!segment.match(/^segment_\d+\.ts$/)) {
        throw new Error('Invalid segment format');
    }
    const torrents = yield getOrCreateTorrents(movieId);
    const torrent = torrents.find((item) => item.quality === quality);
    if (!torrent || !torrent.hlsPlaylistPath) {
        throw new Error('Segment file not found');
    }
    const segmentBase = (0, path_1.dirname)(torrent.hlsPlaylistPath);
    const segmentPath = (0, path_1.join)(process.cwd(), segmentBase, segment);
    yield fs.promises.access(segmentPath, fs.constants.F_OK);
    return segmentPath;
});
exports.getSegmentPath = getSegmentPath;
const getAvailableQualities = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    const torrents = yield getOrCreateTorrents(movieId);
    return torrents
        .map((torrent) => torrent.quality)
        .sort((first, second) => parseInt(second.replace('p', ''), 10) -
        parseInt(first.replace('p', ''), 10))
        .reverse()
        .filter((quality, index, self) => self.indexOf(quality) === index);
});
exports.getAvailableQualities = getAvailableQualities;
const streamFile = (filePath, res) => {
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (error) => {
        res.status(500).json({
            error: 'Failed to stream file',
            message: error.message,
        });
    });
    (0, pump_1.default)(fileStream, res);
};
exports.streamFile = streamFile;
//# sourceMappingURL=torrent.service.js.map