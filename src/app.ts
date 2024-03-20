import express from 'express';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import './db/connection';
import { UserService } from './services/user-service';
import { ErrorLogger } from './utility/ErrorLogger';
import { IUser, UserStatus } from './db/schema/users';

dotenv.config()// load variables from env file.

const app = express();
const server = http.createServer(app);
const config: any = {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    },
}
const io = new Server(server, config);
const PORT = process.env.PORT || 3000;

app.use(cors(config));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket: Socket) => {
    try {
        const emailQuery: string | string[] = socket.handshake.query.email;

        if (typeof emailQuery === 'string') {
            UserService.GetUser({ email: emailQuery }).then(r => {
                console.log(r);

                UserService.UpdateUserSocket(r._id.toString(), socket.id).then(user => {
                    console.log('user updated', user);
                }).catch(e => {
                    console.log(e);
                    ErrorLogger.logError(e);
                });

                UserService.UpdateUserStatus(r._id.toString(), UserStatus.ACTIVE).then(user => {
                    console.log('user updated', user);
                }).catch(e => {
                    console.log(e);
                    ErrorLogger.logError(e);
                });

            }).catch(e => {
                console.log(e);
                ErrorLogger.logError(e);
            });
        }

    
        // join room
        socket.on('start_chat', (userId) => {
            console.log(userId);
        });

        // disconnect
        socket.on('disconnecting',() => {
            UserService.GetUser({ socketID: socket.id }).then(user => {

                UserService.UpdateUserSocket(user._id.toString(), '').then(user1 => {
                    console.log('user updated', user1);
                }).catch(e => {
                    console.log(e);
                    ErrorLogger.logError(e);
                });

                UserService.UpdateUserStatus(user._id.toString(), UserStatus.INACTIVE).then(user2 => {
                    console.log('user updated', user2);
                }).catch(e => {
                    console.log(e);
                    ErrorLogger.logError(e);
                });
            }).catch(e => {
                console.log(e);
                ErrorLogger.logError(e);
            })
        });
    } catch(e) {
        ErrorLogger.logError(e);
    }
});

app.post('/api/user', (req, res) => {
    const { name, email } = req.body;
    const data: any = {
        name: name,
        email: email,
        status: UserStatus.ACTIVE,
        last_seen: new Date()
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

server.listen(PORT, () => {
    console.log('Server is listening on port: %d', PORT);
});