import { LoginMessage } from "$shared/messages/LoginMessage";
import { LogoutMessage } from "$shared/messages/LogoutMessage";
import { Server } from "socket.io";
import { IServerConfig } from "./interfaces/IServerConfig";
import { SocketEventEnum } from "./shared/events/SocketEventEnum";
import { TextMessage } from "./shared/messages/TextMessage";

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

            socket.on(SocketEventEnum.LOGIN, (loginMessage: LoginMessage): void => {
                socket.broadcast.emit(SocketEventEnum.LOGIN, loginMessage);
            });
            socket.on(SocketEventEnum.LOGOUT, (logoutMessage: LogoutMessage): void => {
                console.log(`User ${JSON.stringify(logoutMessage.user)} loggs out`);
                socket.broadcast.emit(SocketEventEnum.LOGOUT, logoutMessage);
            });
            socket.on(SocketEventEnum.TEXT_MESSAGE, (textMessage: TextMessage) => {
                socket.broadcast.emit(SocketEventEnum.TEXT_MESSAGE, textMessage);
            });
        });
    }


    listen(): void {
        this.initConnections();
    }
}