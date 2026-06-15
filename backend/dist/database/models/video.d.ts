import mongoose from "mongoose";
declare const Video: mongoose.Model<{
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
}, mongoose.Document<unknown, {}, {
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    tmdbId: number;
    title: string;
    genres: string[];
    directors: string[];
    actors: mongoose.Types.DocumentArray<{
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }, {}, {}> & {
        name?: string | null;
        character?: string | null;
        profile?: string | null;
    }>;
    watched: boolean;
    torrents: mongoose.Types.ObjectId[];
    imdbId?: string | null;
    year?: string | null;
    duration?: number | null;
    rating?: number | null;
    synopsis?: string | null;
    poster?: string | null;
    backdrop?: string | null;
    trailer?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Video;
//# sourceMappingURL=video.d.ts.map