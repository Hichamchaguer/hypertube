import mongoose, { mongo } from "mongoose";
import { ref } from "node:process";


const historyShema = new mongoose.Schema({

    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    video_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Video'},
    watchAt: {type: Date, default: Date.now()}
});

const history = mongoose.model('History', historyShema);
export default history;