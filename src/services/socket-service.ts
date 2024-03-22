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
            const _user = await UserService.GetUser({ email: email });
            await UserService.UpdateUserSocket(_user._id.toString(), socket_id)
            await UserService.UpdateUserStatus(_user._id.toString(), UserStatus.ACTIVE);
            return _user;
        } catch (error) {
            ErrorLogger.logError(error);
        }
    }

    /**
     * Disconnect User
     * @param socket_id Current socket Id.
     */
    public static async DisconnectUser(socket_id: string) {
        try {
            const _user = await UserService.GetUser({ socketID: socket_id });
            await UserService.UpdateUserSocket(_user._id.toString(), '')
            await UserService.UpdateUserStatus(_user._id.toString(), UserStatus.INACTIVE);
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

    public static async GetChat(chat_id: string): Promise<IChat> {
        try {
            return await ChatService.GetChat({ _id: chat_id });
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