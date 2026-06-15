import mongoose from 'mongoose';
declare const Torrent: mongoose.Model<{
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
}, mongoose.Document<unknown, {}, {
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    movie_id: mongoose.Types.ObjectId;
    quality: string;
    magnetLink: string;
    seeders: number;
    leechers: number;
    downloadStatus: "not_started" | "downloading" | "completed";
    size?: string | null;
    hlsPlaylistPath?: string | null;
    lastWatched?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Torrent;
//# sourceMappingURL=torrent.d.ts.map