import DB from "../db/db";
import models from "../db/mongo-models";
import { IChat } from "../db/schema/chats";
import { IUser } from "../db/schema/users";
import { ErrorLogger } from "../utility/ErrorLogger";
export class UserService {
    constructor() {}

    public static GetUser(email: string): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            const _db = new DB();
            _db.GetDocument<IUser>(models.Users, { email: email }).then((user: IUser | null) => {
                if (!user) {
                    reject('User not found');
                    return;
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
                if(!user) { 
                    reject('User not found');
                    return;
                }

                const userID: string = user._id.toString();
                _db.GetDocument<IChat>(models.Chats, { recipients: {$in: [userID]} }).then((chat: IChat) => {
                    resolve(chat);
                }).catch(e => {
                    ErrorLogger.logError(e);
                    reject(e);
                })
            }).catch(e => {
                ErrorLogger.logError(e);
                reject(e);
            });
        });
    }

    public static CreateOrUpdateUser(user: any) {
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

    public static CreateOrUpdateChat() {
        return new Promise<IChat>((resolve, reject) => {

        });
    }
}