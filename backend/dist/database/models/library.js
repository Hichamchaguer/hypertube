"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const librarySchema = new mongoose_1.default.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    video_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Video', required: true },
    addedAt: { type: Date, default: Date.now }
});
const Library = mongoose_1.default.model('Library', librarySchema);
exports.default = Library;
//# sourceMappingURL=library.js.map