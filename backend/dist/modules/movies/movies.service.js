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
exports.searchMovies = exports.fetchMovieById = exports.fetchPopularMovies = void 0;
const axios_1 = __importDefault(require("axios"));
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
const fetchPopularMovies = () => __awaiter(void 0, void 0, void 0, function* () {
    const tmdb = createTmdbClient();
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
            year: (_a = movie.release_date) === null || _a === void 0 ? void 0 : _a.split('-')[0],
            rating: movie.vote_average,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            synopsis: movie.overview,
            genres: movie.genre_ids,
        });
    });
    return {
        page: response.data.page,
        results: movies,
        total_pages: response.data.total_pages,
    };
});
exports.fetchPopularMovies = fetchPopularMovies;
const fetchMovieById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const tmdb = createTmdbClient();
    const response = yield tmdb.get(`/movie/${id}`, {
        params: {
            append_to_response: 'credits,videos,external_ids',
        },
    });
    const movie = response.data;
    return {
        id: movie.id,
        imdbId: ((_a = movie.external_ids) === null || _a === void 0 ? void 0 : _a.imdb_id) || null,
        title: movie.title,
        year: (_b = movie.release_date) === null || _b === void 0 ? void 0 : _b.split('-')[0],
        rating: movie.vote_average,
        genres: movie.genres.map((g) => g.name),
        synopsis: movie.overview,
        runtime: movie.runtime,
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        directors: movie.credits.crew
            .filter((c) => c.job === 'Director')
            .map((d) => d.name),
        actors: movie.credits.cast.slice(0, 8).map((actor) => ({
            name: actor.name,
            character: actor.character,
            profile: actor.profile_path
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                : null,
        })),
        trailer: (_c = movie.videos.results.find((video) => video.type === 'Trailer')) === null || _c === void 0 ? void 0 : _c.key,
    };
});
exports.fetchMovieById = fetchMovieById;
const searchMovies = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const tmdb = createTmdbClient();
    const response = yield tmdb.get('/search/movie', {
        params: {
            query,
        },
    });
    return response.data.results.map((movie) => {
        var _a;
        return ({
            id: movie.id,
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            year: (_a = movie.release_date) === null || _a === void 0 ? void 0 : _a.split('-')[0],
        });
    });
});
exports.searchMovies = searchMovies;
//# sourceMappingURL=movies.service.js.map