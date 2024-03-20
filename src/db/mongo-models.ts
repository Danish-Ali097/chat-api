import UserSchema, { IUser } from '../db/schema/users';
import { chatSchema, IChat, IMessage, messageSchema } from './schema/chats';
import mongoose from 'mongoose';


const models = {
    Users: mongoose.model<IUser>('Users', UserSchema),
    Message: mongoose.model<IMessage>('Messages', messageSchema),
    Chats: mongoose.model<IChat>('Chats', chatSchema)
};

export default models;