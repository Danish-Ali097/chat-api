import { models } from "mongoose";
import DB from "../db/db";
import { IChat, IMessage } from "../db/schema/chats";
import { ErrorLogger } from "../utility/ErrorLogger";

export class ChatService {
    constructor() { }

    public static GetChatByUser(userId: string): Promise<IChat> {
        return new Promise((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IChat>(models.Chats, { recipients: { $in: [userId] } }).then((chat: IChat) => {
                resolve(chat);
            }).catch(e => {
                ErrorLogger.logError(e);
                reject(e);
            });
        });
    }

    public static addMessageToChat(chatId: string, newMessage: IMessage): Promise<IChat> {
        return new Promise((resolve, reject) => {
            const _db = new DB();
            _db.UpdateDocument<IChat>(models.Chats, { _id: chatId }, {$push: {messages: newMessage}}).then((updatedChat: IChat) => {
                resolve(updatedChat);
            }).catch(e => {
                ErrorLogger.logError(e);
                reject(e);
            })
        });
    }
}