import { fetchMovies } from "./archive";

export const getMovies =
async (req: any, res: any) => {

    try {

        const movies = await fetchMovies();
        res.json(movies);

    } catch (err) {

        res.status(500).json({
            error: "Failed to get movies"
        });
    }
};