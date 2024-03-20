import { Schema, Document } from "mongoose";

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'in_active'
}
export interface IUser extends Document {
    name: string,
    email: string,
    avatar: string,
    status: UserStatus,
    last_seen: Date
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: String,
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.INACTIVE },
    last_seen: Date
});


export default userSchema;