import mongoose from "mongoose";
import { title } from "node:process";



const videoSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    streamURL: { type: String, required: true },
    thumbnailURL: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model("Video", videoSchema);

export default Video;