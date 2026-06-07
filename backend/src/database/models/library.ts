import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    addedAt: { type: Date, default: Date.now }
});

const Library = mongoose.model('Library', librarySchema);

export default Library;