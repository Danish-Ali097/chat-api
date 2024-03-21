import { Schema } from "mongoose";

export interface IMessage {
    _id?: unknown,
    to: string,
    from: string,
    content: string,
    sent_at: Date,
    received_at: Date,
    seen_at: Date
}
// Define the interface for a chat document
export interface IChat {
    _id?: unknown,
    recipients: Array<string>;
    messages: Array<IMessage>;
}

const messageSchema: Schema<IMessage> = new Schema<IMessage>({
    to: { type: String, required: true },
    from: { type: String, required: true },
    content: { type: String, required: true },
    sent_at: { type: Date, required: true },
    received_at: { type: Date, required: true },
    seen_at: { type: Date, required: true }
});

// Define the schema for Chats collection
const chatSchema: Schema<IChat> = new Schema<IChat>({
    recipients: { type: [String], required: true },
    messages: [ messageSchema ]
});

export { chatSchema, messageSchema };
