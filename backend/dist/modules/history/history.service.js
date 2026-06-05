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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHistory = exports.addToHistory = void 0;
const watch_history_1 = __importDefault(require("../../database/models/watch_history"));
const video_1 = __importDefault(require("../../database/models/video"));
const movies_service_1 = require("../movies/movies.service");
const buildVideoPayload = (movieInfo) => {
    var _a, _b;
    return ({
        tmdbId: Number((_a = movieInfo.tmdbId) !== null && _a !== void 0 ? _a : movieInfo.id),
        imdbId: movieInfo.imdbId || undefined,
        title: movieInfo.title,
        year: movieInfo.year || '',
        duration: movieInfo.runtime || 0,
        rating: (_b = movieInfo.rating) !== null && _b !== void 0 ? _b : 0,
        genres: movieInfo.genres || [],
        synopsis: movieInfo.synopsis || '',
        poster: movieInfo.poster || null,
        backdrop: movieInfo.backdrop || null,
        directors: movieInfo.directors || [],
        actors: movieInfo.actors || [],
        trailer: movieInfo.trailer || null,
    });
};
const addToHistory = (userId, movieId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const isImdbId = (id) => /^tt\d+$/i.test(id);
        // 1. Ensure video exists in our database
        let video;
        if (isImdbId(movieId)) {
            video = yield video_1.default.findOne({ imdbId: movieId });
        }
        else {
            video = yield video_1.default.findOne({ tmdbId: Number(movieId) });
        }
        const needsDetails = !video ||
            !video.synopsis ||
            !video.poster ||
            !video.backdrop ||
            !((_a = video.genres) === null || _a === void 0 ? void 0 : _a.length) ||
            !((_b = video.directors) === null || _b === void 0 ? void 0 : _b.length) ||
            !((_c = video.actors) === null || _c === void 0 ? void 0 : _c.length) ||
            !video.trailer ||
            !video.duration ||
            !video.rating ||
            !video.imdbId;
        if (needsDetails) {
            const movieInfo = yield (0, movies_service_1.fetchMovieDetailsById)(movieId);
            const payload = buildVideoPayload(movieInfo);
            if (!video) {
                video = new video_1.default(payload);
                yield video.save();
            }
            else {
                Object.assign(video, payload);
                yield video.save();
            }
        }
        if (!video) {
            throw new Error('Video was not created');
        }
        // 2. Add or update history record
        yield watch_history_1.default.findOneAndUpdate({ user_id: userId, video_id: video._id }, { watchAt: new Date() }, { upsert: true, new: true });
        return { success: true };
    }
    catch (error) {
        console.error('Error adding to history:', error);
        throw error;
    }
});
exports.addToHistory = addToHistory;
const getUserHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield watch_history_1.default.find({ user_id: userId })
            .populate('video_id')
            .sort({ watchAt: -1 })
            .limit(50);
        return history.map((item) => ({
            historyId: item._id,
            watchAt: item.watchAt,
            movie: item.video_id,
        }));
    }
    catch (error) {
        console.error('Error getting user history:', error);
        throw error;
    }
});
exports.getUserHistory = getUserHistory;
//# sourceMappingURL=history.service.js.map