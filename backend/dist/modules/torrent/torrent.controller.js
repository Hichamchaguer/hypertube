"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQualities = exports.getSegment = exports.getPlaylist = exports.startStream = void 0;
const fs_1 = require("fs");
const torrent_service_1 = require("./torrent.service");
const history_service_1 = require("../history/history.service");
const startStream = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const movieId = String(req.params.movieId || '').trim();
        const quality = String(req.params.quality || '').trim();
        if (!movieId || !quality) {
            return res.status(400).json({ error: 'Movie id and quality are required' });
        }
        // Record in history if user is authenticated
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (userId) {
            (0, history_service_1.addToHistory)(userId, movieId).catch(err => console.error('Failed to record history asynchronously:', err));
        }
        const response = yield (0, torrent_service_1.createStream)(movieId, quality);
        return res.json(response);
    }
    catch (err) {
        return res.status(500).json({
            error: 'Failed to start stream',
            message: (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
        });
    }
});
exports.startStream = startStream;
const getPlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = String(req.params.movieId || '').trim();
        const quality = String(req.params.quality || '').trim();
        if (!movieId || !quality) {
            return res.status(400).json({ error: 'Movie id and quality are required' });
        }
        const playlistPath = yield (0, torrent_service_1.getStreamPlaylist)(movieId, quality);
        const content = yield fs_1.promises.readFile(playlistPath, 'utf-8');
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const segmentBase = `${baseUrl}/api/torrent/getSegment/${movieId}/${quality}`;
        const rewritten = content
            .split('\n')
            .map((line) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) {
                return line;
            }
            return `${segmentBase}/${trimmed}`;
        })
            .join('\n');
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        return res.send(rewritten);
    }
    catch (err) {
        return res.status(404).json({
            error: 'Playlist not found',
            message: (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
        });
    }
});
exports.getPlaylist = getPlaylist;
const getSegment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = String(req.params.movieId || '').trim();
        const quality = String(req.params.quality || '').trim();
        const segment = String(req.params.segment || '').trim();
        if (!movieId || !quality || !segment) {
            return res.status(400).json({
                error: 'Movie id, quality, and segment are required',
            });
        }
        res.setHeader('Content-Type', 'video/MP2T');
        res.setHeader('Accept-Ranges', 'bytes');
        const segmentPath = yield (0, torrent_service_1.getSegmentPath)(movieId, quality, segment);
        return (0, torrent_service_1.streamFile)(segmentPath, res);
    }
    catch (err) {
        return res.status(404).json({
            error: 'Segment not found',
            message: (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
        });
    }
});
exports.getSegment = getSegment;
const listQualities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = String(req.params.movieId || '').trim();
        if (!movieId) {
            return res.status(400).json({ error: 'Movie id is required' });
        }
        const qualities = yield (0, torrent_service_1.getAvailableQualities)(movieId);
        return res.json(qualities);
    }
    catch (err) {
        return res.status(500).json({
            error: 'Failed to load qualities',
            message: (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
        });
    }
});
exports.listQualities = listQualities;
//# sourceMappingURL=torrent.controller.js.map