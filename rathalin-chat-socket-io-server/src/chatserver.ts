import { Server } from "socket.io";
import { IServerConfig } from "./interfaces/IServerConfig";
import { SocketEventEnum } from "./shared/events/SocketEventEnum";
import { TextMessage } from "./shared/messages/TextMessage";
import { User } from "./shared/user/User";


export class ChatServer {

    private _server: Server;
    private _connections: number = 0;


    constructor(config: IServerConfig) {

        console.log(`Listening on port ${config.SOCKETIO_PORT}`);
        this._server = new Server(config.SOCKETIO_PORT, {
            cors: {
                origin: `http://localhost:${config.SVELTE_PORT}`,
            }
        });
    }


    initConnections(): void {
        this._server.on('connection', socket => {
            this._connections++;
            console.log(`+ User (${this._connections})`);

            socket.on('disconnect', reason => {
                this._connections--;
                console.log(`- User (${this._connections})`);
            });

            socket.on(SocketEventEnum.LOGIN, (user: User): void => {
                socket.broadcast.emit(SocketEventEnum.LOGIN, user);
            });
            socket.on(SocketEventEnum.LOGOUT, (user: User): void => {
                console.log(`User ${JSON.stringify(user)} loggs out`);
                socket.broadcast.emit(SocketEventEnum.LOGOUT, user);
            });
            socket.on(SocketEventEnum.TEXT_MESSAGE, (textmessage: TextMessage) => {
                socket.broadcast.emit(SocketEventEnum.TEXT_MESSAGE, textmessage);
            });
        });
    }


    listen(): void {
        this.initConnections();
    }
}