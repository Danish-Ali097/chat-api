import { FilterQuery, models } from "mongoose";
import DB from "../db/db";
import { IChat, IMessage } from "../db/schema/chats";

export class ChatService {
    constructor() { }

    public static GetChat(query: FilterQuery<IChat>): Promise<IChat> {
        return new Promise((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IChat>(models.Chats, query).then((chat: IChat) => {
                resolve(chat);
            }).catch(e => {
                reject(e);
            });
        });
    }

    public static GetChats(query: FilterQuery<IChat>): Promise<IChat[]> {
        return new Promise((resolve, reject) => {
            const _db = new DB();
            _db.GetDocuments<IChat>(models.Chats, query).then((chat: IChat[]) => {
                resolve(chat);
            }).catch(e => {
                reject(e);
            });
        });
    }

    public static CreateChat(recipients: Array<string>): Promise<IChat> {
        return new Promise((resolve, reject) => {
            const _chat: IChat = {
                recipients,
                 messages: [] 
            };
            const _db = new DB();
            _db.InsertDocument<IChat>(models.Chats, _chat).then((chat: IChat) => {
                resolve(chat);
            }).catch(e => {
                reject(e);
            })
        });
    }

    public static addMessageToChat(chatId: string, newMessage: IMessage): Promise<IChat> {
        return new Promise((resolve, reject) => {
            const _db = new DB();
            _db.UpdateDocument<IChat>(models.Chats, { _id: chatId }, {$push: {messages: newMessage}})
            .then((updatedChat: IChat) => {
                resolve(updatedChat);
            }).catch(e => {
                reject(e);
            })
        });
    }

    public static UpdateMessage(chat_id: string, message: IMessage): Promise<IChat> {
        return new Promise<IChat>((resolve, reject) => {
            const _db = new DB();
            _db.UpdateDocument<IChat>(models.Chats, { 'messages._id': message._id }, { $set: {
                    'messages.$.content': message.content,
                    'messages.$.received_at': message.received_at,
                    'messages.$.seen_at': message.seen_at
                }
            }).then((chat: IChat) => {
                resolve(chat);
            }).catch(e => reject(e));
        });
    }
}