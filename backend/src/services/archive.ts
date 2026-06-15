import axios from "axios";


export const api = () => {

        const baseURL = process.env.TMDB_BASE_URL;
        const apiKey = process.env.TMDB_API_KEY;
        if (!baseURL || !apiKey) {
            throw new Error('TMDB_BASE_URL or TMDB_API_KEY is not defined in environment');
        }
        const tmdb  = axios.create({
            baseURL: baseURL,
            params: {
                api_key: apiKey,
            },
        });
        return tmdb;
};


export const fetchMovies = async (req: any, res: any) => {
    try {
        
        const tmdb = api();
        const response = await tmdb.get('/movie/popular', {
            params: {
                language: 'en-US',
                page: 1,
            },
        });

        const movies = response.data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date?.split("-")[0],
            rating: movie.vote_average,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
            synopsis: movie.overview,
            genres: movie.genre_ids,
        }));

        res.json({
            page: response.data.page,
            results: movies,
            total_pages: response.data.total_pages
        });

    } catch (err) {
        console.error('fetchMovies error:', err);
        throw new Error('Failed to fetch movies');
    }
};


export const MoviesById = async (req: any, res: any) => {

    try {


        const { id } = req.params;

        const tmdb = api();
        const response = await tmdb.get(`/movie/${id}`, {
            params: {
                append_to_response: "credits,videos"
            }
        });

        const movie = response.data;

        const formatted = {
            id: movie.id,
            title: movie.title,
            year: movie.release_date?.split("-")[0],
            rating: movie.vote_average,
            genres: movie.genres.map((g: any) => g.name),
            synopsis: movie.overview,
            runtime: movie.runtime,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,

            directors: movie.credits.crew
                .filter((c: any) => c.job === "Director")
                .map((d: any) => d.name),

            actors: movie.credits.cast
                .slice(0, 8)
                .map((a: any) => ({
                    name: a.name,
                    character: a.character,
                    profile: a.profile_path
                        ? `https://image.tmdb.org/t/p/w200${a.profile_path}`
                        : null
                })),

            trailer: movie.videos.results.find(
                (v: any) => v.type === "Trailer"
            )?.key
        };

        res.json(formatted);

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
};


export const _searchMovies = async (req: any, res: any) => {

    try {

        const query = req.query.q;
        const tmdb = api();
        const response = await tmdb.get("/search/movie", {
            params: {
                query
            }
        });

        const results = response.data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            year: movie.release_date?.split("-")[0],
        }));

        res.json(results);

    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
};


