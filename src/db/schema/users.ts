import { Schema } from "mongoose";

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'in_active'
}
export interface IUser {
    _id?: unknown,
    socketID: string,
    name: string,
    email: string,
    avatar: string,
    status: UserStatus,
    last_seen: Date
}

const userSchema = new Schema<IUser>({
    socketID: String,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: String,
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.INACTIVE },
    last_seen: Date
});


export default userSchema;