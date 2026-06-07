"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const torrentSchema = new mongoose_1.default.Schema({
    movie_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Video', required: true },
    quality: { type: String, required: true },
    magnetLink: { type: String, required: true },
    size: { type: String },
    seeders: { type: Number, default: 0 },
    leechers: { type: Number, default: 0 },
    downloadStatus: {
        type: String,
        enum: ['not_started', 'downloading', 'completed'],
        default: 'not_started',
    },
    hlsPlaylistPath: { type: String, default: null },
    lastWatched: { type: Date, default: null },
});
torrentSchema.index({ movie_id: 1, quality: 1 }, { unique: true });
torrentSchema.set('timestamps', true);
const Torrent = mongoose_1.default.model('Torrent', torrentSchema);
exports.default = Torrent;
//# sourceMappingURL=torrent.js.map