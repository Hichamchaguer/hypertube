import mongoose from "mongoose";
declare const Library: mongoose.Model<{
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
}, mongoose.Document<unknown, {}, {
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    watchAt: NativeDate;
    user_id?: mongoose.Types.ObjectId | null;
    video_id?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Library;
//# sourceMappingURL=library.d.ts.map