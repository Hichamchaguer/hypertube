export declare const addToHistory: (userId: string, movieId: string) => Promise<{
    success: boolean;
}>;
export declare const getUserHistory: (userId: string) => Promise<{
    historyId: any;
    watchAt: any;
    movie: any;
}[]>;
//# sourceMappingURL=history.service.d.ts.map