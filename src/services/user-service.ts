import { FilterQuery } from "mongoose";
import DB from "../db/db";
import models from "../db/mongo-models";
import { IChat } from "../db/schema/chats";
import { IUser, UserStatus } from "../db/schema/users";
import { ChatService } from "./chat-service";
export class UserService {
    constructor() {}

    public static GetUser(filter: FilterQuery<IUser>): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IUser>(models.Users, filter).then((user: IUser | null) => {
                if (!user) {
                    reject('User not found');
                }

                resolve(user);
            }).catch(e => {
                reject(e);
            });
        });
    }

    public static GetUsers(filter: FilterQuery<IUser>): Promise<IUser[]> {
        return new Promise<IUser[]>((resolve, reject) => {
            const _db = new DB();
            _db.GetDocuments<IUser>(models.Users, filter).then((users) => {
                resolve(users);
            }).catch(e => {
                reject(e);
            })
        });
    }

    public static GetUserChats(filter: FilterQuery<IUser>): Promise<IChat> {
        return new Promise<IChat>((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IUser>(models.Users, filter).then((user: IUser | null) => {
                if (!user) {
                    reject('User not found');
                }

                const userID: string = user._id.toString();
                ChatService.GetChatByUser(userID)
            }).catch(e => {
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
                reject(e);
            })
        });
    }

    public static UpdateUserStatus(userId: string, status: UserStatus) {
        return new Promise((resolve, reject) => {
            const _db = new DB();
            _db.UpdateDocument<IUser>(models.Users, { _id: userId }, { status: status, last_seen: new Date() }).then((updatedUser: IUser) => {
                resolve(updatedUser);
            }).catch(e => {
                reject(e);
            })
        });
    }

    public static CreateOrUpdateUser(user: IUser) {
        return new Promise<IUser>((resolve, reject) => {
            const _db = new DB();
            if(Object.keys(user).includes('_id') && user._id.length > 0) {
                _db.UpdateDocument<IUser>(models.Users, { _id: user._id.toString() }, user).then((updatedUser: IUser) => {
                    resolve(updatedUser);
                }).catch(e => {

                    reject(e);
                })
            } else {
                _db.InsertDocument<IUser>(models.Users, user).then((user:IUser) => {
                    resolve(user);
                }).catch(e => {

                    reject(e);
                })
            }
        });
    }

    public static CreateOrUpdateChat(chat: IChat) {
        return new Promise<IChat>((resolve, reject) => {
            const _db = new DB();
            if (Object.keys(chat).includes('_id') && chat._id.length > 0) {
                _db.UpdateDocument<IChat>(models.Chats, { _id: chat._id.toString() }, chat).then((updatedChat: IChat) => {
                    resolve(updatedChat);
                }).catch(e => {

                    reject(e);
                })
            } else {
                _db.InsertDocument<IChat>(models.Chats, chat).then((chat: IChat) => {
                    resolve(chat);
                }).catch(e => {
                    reject(e);
                })
            }
        });
    }
}