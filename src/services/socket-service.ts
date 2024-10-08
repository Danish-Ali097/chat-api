import { IChat, IMessage } from "../db/schema/chats";
import { IUser, UserStatus } from "../db/schema/users";
import { ErrorLogger } from "../utility/ErrorLogger";
import { ChatService } from "./chat-service";
import { UserService } from "./user-service";

export class SocketService {
    constructor() {

    }

    /**
     * Connect User
     * @param email User email address.
     * @param socket_id Current socket Id.
     */
    public static async ConnectUser(email: string, socket_id: string): Promise<IUser> {
        try {
            let _user = await UserService.GetUser({ email: email });
            _user.socketID = socket_id;
            _user.status = UserStatus.ACTIVE;
            _user.last_seen = new Date();
            _user = await UserService.CreateOrUpdateUser(_user);
            return _user;
        } catch (error) {
            ErrorLogger.logError(error);
        }
    }

    /**
     * Disconnect User
     * @param socket_id Current socket Id.
     */
    public static async DisconnectUser(socket_id: string): Promise<IUser> {
        try {
            let _user = await UserService.GetUser({ socketID: socket_id });
            _user.socketID = '';
            _user.status = UserStatus.INACTIVE;
            _user.last_seen = new Date();
            _user = await UserService.CreateOrUpdateUser(_user);
            return _user;
        } catch (error) {
            ErrorLogger.logError(error);
        }
    }

    /**
     * Create new chat and returns the newly created chat.
     */
    public static async StartChat(socket_id: string, user_id: string): Promise<IChat> {
        try {
            const _user = await UserService.GetUser({ socketID: socket_id });
            return await ChatService.CreateChat([_user._id.toString(), user_id]);
        } catch (error) {
            ErrorLogger.logError(error);
        }
    }

    /**
     * 
     * @param chat_id Id of chat we want to fetch.
     * @param message_rows how many rows in messages, default 50.
     * @param message_from from which row messages array start from, default = 0.
     * @returns 
     */
    public static async GetChat(chat_id: string, message_rows: number = 50, message_from: number = 0): Promise<IChat> {
        try {
            return await ChatService.GetChat({ _id: chat_id }, message_rows, message_from);
        } catch (error) {
            ErrorLogger.logError(error);
        }
    }

    /**
     * Create a new Message
     * @param chat_id id of the Chat in which message is sent.
     * @param message message content to send
     * @param socket_id 
     */
    public static async SendMessage(chat_id: string, message: IMessage, socket_id: string): Promise<IChat> {
        try {
            const _user = await UserService.GetUser({ socketID: socket_id });
            const _chat = await ChatService.GetChat({ _id: chat_id });
            message.from = _user._id.toString();
            message.to = _chat.recipients.filter(x => x !== _user._id.toString())[0];
            const chat = await ChatService.addMessageToChat(chat_id, message);
            return chat;
        } catch (error) {
            ErrorLogger.logError(error);
        }
    }

    public static async UpdateMessage(chat_id: string, message: IMessage): Promise<IChat> {
        try {
            return await ChatService.UpdateMessage(chat_id, message);
        } catch (error) {
            ErrorLogger.logError(error);
        }
    }
}