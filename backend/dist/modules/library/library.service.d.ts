export declare const toggleFavorite: (userId: string, movieId: string) => Promise<{
    success: boolean;
    action: string;
}>;
export declare const getUserLibrary: (userId: string) => Promise<{
    libraryId: any;
    addedAt: any;
    movie: any;
}[]>;
//# sourceMappingURL=library.service.d.ts.map