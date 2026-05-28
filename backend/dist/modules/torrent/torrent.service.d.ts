export interface StreamResponse {
    success: boolean;
    movieId: string;
    hlsUrl: string | null;
    message: string;
}
export declare const createStream: (movieId: string, quality: string) => Promise<StreamResponse>;
export declare const getStreamPlaylist: (movieId: string, quality: string) => Promise<string>;
export declare const getSegmentPath: (movieId: string, quality: string, segment: string) => Promise<string>;
export declare const getAvailableQualities: (movieId: string) => Promise<string[]>;
export declare const streamFile: (filePath: string, res: any) => void;
//# sourceMappingURL=torrent.service.d.ts.map