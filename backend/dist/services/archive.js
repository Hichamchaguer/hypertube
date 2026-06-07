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
exports._searchMovies = exports.MoviesById = exports.fetchMovies = exports.api = void 0;
const axios_1 = __importDefault(require("axios"));
const api = () => {
    const baseURL = process.env.TMDB_BASE_URL;
    const apiKey = process.env.TMDB_API_KEY;
    if (!baseURL || !apiKey) {
        throw new Error('TMDB_BASE_URL or TMDB_API_KEY is not defined in environment');
    }
    const tmdb = axios_1.default.create({
        baseURL: baseURL,
        params: {
            api_key: apiKey,
        },
    });
    return tmdb;
};
exports.api = api;
const fetchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tmdb = (0, exports.api)();
        const response = yield tmdb.get('/movie/popular', {
            params: {
                language: 'en-US',
                page: 1,
            },
        });
        const movies = response.data.results.map((movie) => {
            var _a;
            return ({
                id: movie.id,
                title: movie.title,
                year: (_a = movie.release_date) === null || _a === void 0 ? void 0 : _a.split("-")[0],
                rating: movie.vote_average,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                synopsis: movie.overview,
                genres: movie.genre_ids,
            });
        });
        res.json({
            page: response.data.page,
            results: movies,
            total_pages: response.data.total_pages
        });
    }
    catch (err) {
        console.error('fetchMovies error:', err);
        throw new Error('Failed to fetch movies');
    }
});
exports.fetchMovies = fetchMovies;
const MoviesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const tmdb = (0, exports.api)();
        const response = yield tmdb.get(`/movie/${id}`, {
            params: {
                append_to_response: "credits,videos"
            }
        });
        const movie = response.data;
        const formatted = {
            id: movie.id,
            title: movie.title,
            year: (_a = movie.release_date) === null || _a === void 0 ? void 0 : _a.split("-")[0],
            rating: movie.vote_average,
            genres: movie.genres.map((g) => g.name),
            synopsis: movie.overview,
            runtime: movie.runtime,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            directors: movie.credits.crew
                .filter((c) => c.job === "Director")
                .map((d) => d.name),
            actors: movie.credits.cast
                .slice(0, 8)
                .map((a) => ({
                name: a.name,
                character: a.character,
                profile: a.profile_path
                    ? `https://image.tmdb.org/t/p/w200${a.profile_path}`
                    : null
            })),
            trailer: (_b = movie.videos.results.find((v) => v.type === "Trailer")) === null || _b === void 0 ? void 0 : _b.key
        };
        res.json(formatted);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
});
exports.MoviesById = MoviesById;
const _searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        const tmdb = (0, exports.api)();
        const response = yield tmdb.get("/search/movie", {
            params: {
                query
            }
        });
        const results = response.data.results.map((movie) => {
            var _a;
            return ({
                id: movie.id,
                title: movie.title,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                year: (_a = movie.release_date) === null || _a === void 0 ? void 0 : _a.split("-")[0],
            });
        });
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
});
exports._searchMovies = _searchMovies;
//# sourceMappingURL=archive.js.map