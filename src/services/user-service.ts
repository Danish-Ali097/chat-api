import { FilterQuery } from "mongoose";
import DB from "../db/db";
import models from "../db/mongo-models";
import { IChat } from "../db/schema/chats";
import { IUser } from "../db/schema/users";
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

    public static GetUserChats(filter: FilterQuery<IUser>): Promise<IChat[]> {
        return new Promise<IChat[]>((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IUser>(models.Users, filter).then((user: IUser | null) => {
                if (!user) {
                    reject('User not found');
                }
                const userID: string = user._id.toString();
                ChatService.GetChats({ recipients: { $in: [userID] } }).then( chat => {
                    resolve(chat);
                }).catch(e => {
                    reject(e);
                });
            }).catch(e => {
                reject(e);
            });
        });
    }

    public static CreateOrUpdateUser(user: IUser) {
        return new Promise<IUser>((resolve, reject) => {
            const _db = new DB();
            if(Object.keys(user).includes('_id') && user._id !== '') {
                const _usr = { 
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    status: user.status,
                    socketID: user.socketID,
                    last_seen: user.last_seen
                };
                _db.UpdateDocument<IUser>(models.Users, { _id: user._id.toString() }, _usr).then((updatedUser: IUser) => {
                    resolve(updatedUser);
                }).catch(e => {

                    reject(e);
                })
            } else {
                _db.InsertDocument<IUser>(models.Users, user).then((user: IUser) => {
                    resolve(user);
                }).catch(e => {

                    reject(e);
                })
            }
        });
    }
}