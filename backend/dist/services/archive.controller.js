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
exports.searchMovies = exports.getMoviesById = exports.getMovies = void 0;
const archive_1 = require("./archive");
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield (0, archive_1.fetchMovies)(req, res);
        res.json(movies);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to get movies"
        });
    }
});
exports.getMovies = getMovies;
const getMoviesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = yield (0, archive_1.MoviesById)(req, res);
        res.json(movie);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to get movie details"
        });
    }
});
exports.getMoviesById = getMoviesById;
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield (0, archive_1._searchMovies)(req, res);
        res.json(movies);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to search movies"
        });
    }
});
exports.searchMovies = searchMovies;
//# sourceMappingURL=archive.controller.js.map