import DB from "../db/db";
import models from "../db/mongo-models";
import { IChat } from "../db/schema/chats";
import { IUser } from "../db/schema/users";
import { ErrorLogger } from "../utility/ErrorLogger";
import { ChatService } from "./chat-service";
export class UserService {
    constructor() {}

    public static GetUser(email: string): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IUser>(models.Users, { email: email }).then((user: IUser | null) => {
                if (!user) {
                    throw new Error('User not found');
                }

                resolve(user);
            }).catch(e => {
                ErrorLogger.logError(e);
                reject(e);
            });
        });
    }
    public static GetUserChats(email: string): Promise<IChat> {
        return new Promise<IChat>((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IUser>(models.Users, { email: email }).then((user: IUser | null) => {
                if (!user) {
                    throw new Error('User not found');
                }

                const userID: string = user._id.toString();
                ChatService.GetChatByUser(userID)
            }).catch(e => {
                ErrorLogger.logError(e);
                reject(e);
            });
        });
    }

    public static UpdateUserSocket(userId: string, socketId: string) {
        return new Promise((resolve, reject) => {
            const _db = new DB();
            _db.UpdateDocument<IUser>(models.Users, { _id: userId }, { socketID: socketId }).then((updatedUser: IUser) => {
                resolve(updatedUser);
            }).catch(e => {
                ErrorLogger.logError(e);
                reject(e);
            })
        });
    }

    public static CreateOrUpdateUser(user: IUser) {
        return new Promise<IUser>((resolve, reject) => {
            const _db = new DB();
            if(Object.keys(user).includes('_id') && user._id.length > 0) {
                _db.UpdateDocument<IUser>(models.Users, { _id: user._id }, user).then((updatedUser: IUser) => {
                    resolve(updatedUser);
                }).catch(e => {
                    ErrorLogger.logError(e);
                    reject(e);
                })
            } else {
                _db.InsertDocument<IUser>(models.Users, user).then((user:IUser) => {
                    resolve(user);
                }).catch(e => {
                    ErrorLogger.logError(e);
                    reject(e);
                })
            }
        });
    }

    public static CreateOrUpdateChat(chat: IChat) {
        return new Promise<IChat>((resolve, reject) => {
            const _db = new DB();
            if (Object.keys(chat).includes('_id') && chat._id.length > 0) {
                _db.UpdateDocument<IChat>(models.Chats, { _id: chat._id }, chat).then((updatedChat: IChat) => {
                    resolve(updatedChat);
                }).catch(e => {
                    ErrorLogger.logError(e);
                    reject(e);
                })
            } else {
                _db.InsertDocument<IChat>(models.Chats, chat).then((chat: IChat) => {
                    resolve(chat);
                }).catch(e => {
                    ErrorLogger.logError(e);
                    reject(e);
                })
            }
        });
    }
}