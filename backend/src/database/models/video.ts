import mongoose from "mongoose";
import { title } from "node:process";



const videoSchema = new mongoose.Schema({

    tmdbId: { type: Number, required: true, unique: true },
    imdbId: { type: String },
    title: { type: String, required: true },
    year: { type: String },
    duration: { type: Number },
    rating: { type: Number },
    genres : [ { type: String } ],
    synopsis: { type: String },
    directors: [ { type: String } ],
    actors: [ { name: String, character: String, profile: String } ],
    poster: { type: String },
    backdrop: { type: String },
    trailer: { type: String },
    watched: { type: Boolean, default: false },
    torrents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Torrent' }],
});

const Video = mongoose.model("Video", videoSchema);

export default Video;