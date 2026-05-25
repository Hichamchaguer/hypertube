import api from "../axios";

export const fetchUser = async () => {
    try {
        const response = await api.get("/user");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user session", error);
        throw new Error("Failed to fetch user session");
    }
};


export const fetchMovies = async () => {
    try {
        const response = await api.get("/movies");
        return response.data.results;
    } catch (error) {
        console.error("Failed to fetch movies", error);
        throw new Error("Failed to fetch movies");
    }
};

export const fetchMovieById = async (id: string) => {
    try {
        const response = await api.get(`/movies/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch movie with id ${id}`, error);
        throw new Error(`Failed to fetch movie with id ${id}`);
    }
};