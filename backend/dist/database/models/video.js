"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const videoSchema = new mongoose_1.default.Schema({
    tmdbId: { type: Number, required: true, unique: true },
    imdbId: { type: String },
    title: { type: String, required: true },
    year: { type: String },
    duration: { type: Number },
    rating: { type: Number },
    genres: [{ type: String }],
    synopsis: { type: String },
    directors: [{ type: String }],
    actors: [{ name: String, character: String, profile: String }],
    poster: { type: String },
    backdrop: { type: String },
    trailer: { type: String },
    watched: { type: Boolean, default: false },
    torrents: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Torrent' }],
});
const Video = mongoose_1.default.model("Video", videoSchema);
exports.default = Video;
//# sourceMappingURL=video.js.map