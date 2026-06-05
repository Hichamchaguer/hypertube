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
exports.searchMovies = exports.fetchMovieDetailsById = exports.fetchMovieById = exports.fetchPopularMovies = exports.resolveMovieIds = void 0;
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
const isImdbId = (id) => /^tt\d+$/i.test(id);
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
exports.resolveMovieIds = resolveMovieIds;
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
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
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
        runtime: movie.runtime || 0,
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
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
const fetchMovieDetailsById = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const { tmdbId, imdbId } = yield (0, exports.resolveMovieIds)(movieId);
    const tmdb = createTmdbClient();
    const response = yield tmdb.get(`/movie/${tmdbId}`, {
        params: {
            append_to_response: 'credits,videos,external_ids',
        },
    });
    const movie = response.data;
    const resolvedImdbId = ((_a = movie.external_ids) === null || _a === void 0 ? void 0 : _a.imdb_id) || imdbId;
    return {
        id: movie.id,
        tmdbId: String(movie.id),
        imdbId: resolvedImdbId || null,
        title: movie.title,
        year: ((_b = movie.release_date) === null || _b === void 0 ? void 0 : _b.split('-')[0]) || '',
        rating: (_c = movie.vote_average) !== null && _c !== void 0 ? _c : 0,
        genres: ((_d = movie.genres) === null || _d === void 0 ? void 0 : _d.map((g) => g.name)) || [],
        synopsis: movie.overview || '',
        runtime: movie.runtime || 0,
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null,
        directors: ((_f = (_e = movie.credits) === null || _e === void 0 ? void 0 : _e.crew) === null || _f === void 0 ? void 0 : _f.filter((c) => c.job === 'Director').map((d) => d.name)) || [],
        actors: ((_h = (_g = movie.credits) === null || _g === void 0 ? void 0 : _g.cast) === null || _h === void 0 ? void 0 : _h.slice(0, 8).map((actor) => ({
            name: actor.name,
            character: actor.character,
            profile: actor.profile_path
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                : null,
        }))) || [],
        trailer: (_l = (_k = (_j = movie.videos) === null || _j === void 0 ? void 0 : _j.results) === null || _k === void 0 ? void 0 : _k.find((video) => video.type === 'Trailer')) === null || _l === void 0 ? void 0 : _l.key,
    };
});
exports.fetchMovieDetailsById = fetchMovieDetailsById;
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
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            year: (_a = movie.release_date) === null || _a === void 0 ? void 0 : _a.split('-')[0],
        });
    });
});
exports.searchMovies = searchMovies;
//# sourceMappingURL=movies.service.js.map