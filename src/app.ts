import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import './db/connection';
import { UserService } from './services/user-service';

dotenv.config()// load variables from env file.

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

io.on('connection', (socket: Socket) => {
    const emailQuery: string | string[] = socket.handshake.query.email;

    if (typeof emailQuery === 'string') {
        const email: string = emailQuery;
        UserService.GetUserChats(email)
            .then((chats) => {
                socket.emit('user-chats', chats);
            });
    } else {
        // Handle the case when emailQuery is an array
        console.error('Unexpected format for email query:', emailQuery);
    }
    console.log('connected', socket);
});

server.listen(PORT, () => {
    console.log('Server is listening on port: %d', PORT);
});