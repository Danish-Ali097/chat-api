import express from 'express';
import cors from 'cors';
import { Server, ServerOptions, Socket } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import './db/connection';
import { UserService } from './services/user-service';
import { ErrorLogger } from './utility/ErrorLogger';
import { IUser, UserStatus } from './db/schema/users';
import { SocketService } from './services/socket-service';
import { IMessage } from './db/schema/chats';

dotenv.config()// load variables from env file.

const app = express();
const server = http.createServer(app);
const config: ServerOptions | unknown = {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
}
const io = new Server(server, config);
const PORT = process.env.PORT || 3000;

app.use(cors(config));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', async (socket: Socket) => {
    try {
        const emailQuery: string | string[] = socket.handshake.query.email;

        if (typeof emailQuery === 'string' && emailQuery !== 'undefined') {
            const user = await SocketService.ConnectUser(emailQuery, socket.id);
            socket.emit('user_details', user);
        }
    
        // create chat
        socket.on('start_chat', async (userId) => {
            const chat = await SocketService.StartChat(socket.id, userId);
            const chat_id = chat._id.toString();
            socket.join(chat_id);
            socket.emit('selected_chat', chat);
        });

        // open existing chat
        socket.on('open_chat', async (chatId) => {
            const chat = await SocketService.GetChat(chatId);
            socket.join(chatId);
            socket.emit('selected_chat', chat);
        });

        // send chat
        socket.on('send_message', async (data) => {
            const { chat_id, message } = data;
            const _msg: IMessage = {
                to: '',
                from: '',
                content: message,
                sent_at: new Date(),
                received_at: null,
                seen_at: null
            };
            const chat = await SocketService.SendMessage(chat_id, _msg, socket.id);
            const _m = chat.messages[chat.messages.length - 1];
            io.emit(chat._id.toString(), chat);
            io.to(chat_id).emit('new_message', _m);
        });

        // update message
        socket.on('update_message', async (data) => {
            const { chat_id, message } = data;
            const _chat = await SocketService.UpdateMessage(chat_id, message);
            const _message = _chat.messages.find((x) => x._id.toString() === message._id);
            io.to(chat_id).emit('updated_message', _message);
            io.emit(chat_id + '_updated_message', { chat_id, message: _message });
        });

        // disconnect
        socket.on('disconnecting', async () => {
            await SocketService.DisconnectUser(socket.id);
        });
    } catch(e) {
        ErrorLogger.logError(e);
    }
});

app.post('/api/user', (req, res) => {
    const { name, email } = req.body;
    const data: IUser = {
        name: name,
        email: email,
        socketID: '',
        avatar: '',
        status: UserStatus.ACTIVE,
        last_seen: new Date(),
    }
    UserService.CreateOrUpdateUser(data)
    .then(user => {
        return res.json(user);
    }).catch(e => {
        ErrorLogger.logError(e);
        return res.status(500).json(e);
    })
});

app.get('/api/autocomplete', (req, res) => {
    const { q } = req.query;
    const regexPattern = new RegExp('.*' + q + '.*')
    UserService.GetUsers({ email: { $regex: regexPattern } }).then(users => {
        return res.json(users);
    }).catch(e => {
        ErrorLogger.logError(e);
        return res.status(500).json(e);
    });
});

app.get('/api/chat', (req, res) => {
    const { user_id } = req.query;
    UserService.GetUserChats({ _id: user_id }).then(chats => {
        return res.json(chats);
    }).catch(e => {
        ErrorLogger.logError(e);
        return res.status(500).json(e);
    });
});

app.get('/api/users', (req, res) => {
    UserService.GetUsers({}).then(users => {
        return res.json(users);
    }).catch(e => {
        ErrorLogger.logError(e);
        return res.status(500).json(e);
    });
});

server.listen(PORT, () => {
    console.log('Server is listening on port: %d', PORT);
});