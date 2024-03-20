import { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    to: string,
    from: string,
    content: string,
    sent_at: Date,
    received_at: Date,
    seen_at: Date
}
// Define the interface for a chat document
export interface IChat extends Document {
    recipients: Array<string>;
    messages: Array<IMessage>;
}

// Define the schema for Chats collection
const chatSchema: Schema<IChat> = new Schema<IChat>({
    recipients: { type: [String], required: true },
    messages: { type: [Object], required: true }
});


export default chatSchema;
