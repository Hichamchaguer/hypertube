import mongoose from "mongoose";
declare const Library: mongoose.Model<{
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
}, mongoose.Document<unknown, {}, {
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user_id: mongoose.Types.ObjectId;
    video_id: mongoose.Types.ObjectId;
    addedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Library;
//# sourceMappingURL=library.d.ts.map