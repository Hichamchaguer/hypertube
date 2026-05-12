import mongoose from "mongoose";
declare const User: mongoose.Model<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
}, mongoose.Document<unknown, {}, {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    provider: string;
    createdAt: NativeDate;
    password?: string | null;
    providerId?: string | null;
    profilePicture?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default User;
//# sourceMappingURL=user.d.ts.map