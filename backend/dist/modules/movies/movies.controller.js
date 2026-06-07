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
exports.searchMoviesHandler = exports.getMovieById = exports.getMovies = void 0;
const movies_service_1 = require("./movies.service");
const getMovies = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield (0, movies_service_1.fetchPopularMovies)();
        return res.json(movies);
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to get movies' });
    }
});
exports.getMovies = getMovies;
const getMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = String(req.params.id || '').trim();
        if (!movieId) {
            return res.status(400).json({ error: 'Movie id is required' });
        }
        const movie = yield (0, movies_service_1.fetchMovieById)(movieId);
        return res.json(movie);
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to get movie details' });
    }
});
exports.getMovieById = getMovieById;
const searchMoviesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = String(req.query.q || '').trim();
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        const results = yield (0, movies_service_1.searchMovies)(query);
        return res.json(results);
    }
    catch (err) {
        return res.status(500).json({ error: 'Search failed' });
    }
});
exports.searchMoviesHandler = searchMoviesHandler;
//# sourceMappingURL=movies.controller.js.map