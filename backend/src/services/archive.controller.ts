import { _searchMovies, fetchMovies, MoviesById } from "./archive";

export const getMovies =
async (req: any, res: any) => {

    try {

        const movies = await fetchMovies(req, res);
        res.json(movies);

    } catch (err) {

        res.status(500).json({
            error: "Failed to get movies"
        });
    }
};

export const getMoviesById = async (req: any, res: any) => {

    try {

        const movie = await MoviesById(req, res);
        res.json(movie);

    } catch (err) {

        res.status(500).json({
            error: "Failed to get movie details"
        });
    }
};

export const searchMovies = async (req: any, res: any) => {

    try {

        const movies = await _searchMovies(req, res);
        res.json(movies);

    } catch (err) {

        res.status(500).json({
            error: "Failed to search movies"
        });
    }
};