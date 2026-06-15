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
const addToHistory = (userId, movieId) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!video) {
            // Fetch details from TMDB to ensure we have the minimum data
            const movieInfo = yield (0, movies_service_1.fetchMovieById)(movieId);
            video = new video_1.default({
                tmdbId: movieInfo.id,
                imdbId: movieInfo.imdbId,
                title: movieInfo.title,
                year: movieInfo.year,
                duration: movieInfo.runtime,
                rating: movieInfo.rating,
                genres: movieInfo.genres,
                synopsis: movieInfo.synopsis,
                poster: movieInfo.poster,
                backdrop: movieInfo.backdrop,
            });
            yield video.save();
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