export declare const registerUser: (payload: any) => Promise<import("mongoose").Document<unknown, {}, {
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
}, import("mongoose").DefaultSchemaOptions> & Omit<{
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}>;
export declare const loginUser: (payload: any) => Promise<{
    token: string;
}>;
export declare const getUserFromToken: (token?: string) => Promise<(import("mongoose").Document<unknown, {}, {
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
}, import("mongoose").DefaultSchemaOptions> & Omit<{
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}) | null>;
export declare const getAllUsers: () => Promise<(import("mongoose").Document<unknown, {}, {
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
}, import("mongoose").DefaultSchemaOptions> & Omit<{
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
})[]>;
//# sourceMappingURL=auth.service.d.ts.map