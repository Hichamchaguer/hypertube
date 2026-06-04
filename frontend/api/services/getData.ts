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
        const data = response.data;
        return Array.isArray(data) ? data : data.results;
    } catch (error) {
        console.error("Failed to fetch movies", error);
        throw new Error("Failed to fetch movies");
    }
};

export const fetchMovieById = async (id: string) => {
    try {
        const response = await api.get(`/movies/${id}`)
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch movie with id ${id}`, error);
        throw new Error(`Failed to fetch movie with id ${id}`);
    }
};

export const fetchAvailableQualities = async (imdbId: string) => {
    try {
        const response = await api.get(`/torrent/availableQualities/${imdbId}`);
        return response.data as string[];
    } catch (error) {
        console.error(`Failed to fetch qualities for ${imdbId}`, error);
        throw new Error(`Failed to fetch qualities for ${imdbId}`);
    }
};

export const startTorrentStream = async (imdbId: string, quality: string) => {
    try {
        const response = await api.get(`/torrent/stream/${imdbId}/${quality}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to start stream for ${imdbId}`, error);
        throw new Error(`Failed to start stream for ${imdbId}`);
    }
};

export const fetchWatchHistory = async () => {
    try {
        const response = await api.get("/history");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch watch history", error);
        throw new Error("Failed to fetch watch history");
    }
};