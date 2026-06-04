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
exports.getUserLibrary = exports.toggleFavorite = void 0;
const library_1 = __importDefault(require("../../database/models/library"));
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
const toggleFavorite = (userId, movieId) => __awaiter(void 0, void 0, void 0, function* () {
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
        // 2. Check if already in library
        const existing = yield library_1.default.findOne({ user_id: userId, video_id: video._id });
        if (existing) {
            yield library_1.default.deleteOne({ _id: existing._id });
            return { success: true, action: 'removed' };
        }
        else {
            yield library_1.default.create({ user_id: userId, video_id: video._id });
            return { success: true, action: 'added' };
        }
    }
    catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
});
exports.toggleFavorite = toggleFavorite;
const getUserLibrary = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const library = yield library_1.default.find({ user_id: userId })
            .populate('video_id')
            .sort({ addedAt: -1 });
        return library.map((item) => ({
            libraryId: item._id,
            addedAt: item.addedAt,
            movie: item.video_id,
        }));
    }
    catch (error) {
        console.error('Error getting user library:', error);
        throw error;
    }
});
exports.getUserLibrary = getUserLibrary;
//# sourceMappingURL=library.service.js.map