import mongoose from "mongoose";
import { ref } from "node:process";



const librarySchema = new mongoose.Schema({

    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    video_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
    watchAt: {type: Date, default: Date.now()}
});

const Library = mongoose.model('Library', librarySchema);

export default Library;