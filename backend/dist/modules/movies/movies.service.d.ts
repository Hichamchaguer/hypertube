export declare const resolveMovieIds: (movieId: string) => Promise<{
    tmdbId: string;
    imdbId: string | null;
}>;
export declare const fetchPopularMovies: () => Promise<{
    page: any;
    results: any;
    total_pages: any;
}>;
export declare const fetchMovieById: (id: string) => Promise<{
    id: any;
    imdbId: any;
    title: any;
    year: any;
    rating: any;
    genres: any;
    synopsis: any;
    runtime: any;
    poster: string | null;
    backdrop: string | null;
    directors: any;
    actors: any;
    trailer: any;
}>;
export declare const fetchMovieDetailsById: (movieId: string) => Promise<{
    id: any;
    tmdbId: string;
    imdbId: any;
    title: any;
    year: any;
    rating: any;
    genres: any;
    synopsis: any;
    runtime: any;
    poster: string | null;
    backdrop: string | null;
    directors: any;
    actors: any;
    trailer: any;
}>;
export declare const searchMovies: (query: string) => Promise<any>;
//# sourceMappingURL=movies.service.d.ts.map