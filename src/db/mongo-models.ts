import UserSchema, { IUser } from '../db/schema/users';
import ChatSchema, { IChat } from '../db/schema/chats';
import mongoose from 'mongoose';


const models = {
    Users: mongoose.model<IUser>('Users', UserSchema),
    Chats: mongoose.model<IChat>('Chats', ChatSchema)
};

export default models;