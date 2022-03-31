import { LoginMessage } from "$shared/messages/LoginMessage";
import { LogoutMessage } from "$shared/messages/LogoutMessage";
import { User } from "$shared/user/User";
import { Server, Socket } from "socket.io";
import { IServerConfig } from "./interfaces/IServerConfig";
import { SocketEventEnum } from "./shared/events/SocketEventEnum";
import { TextMessage } from "./shared/messages/TextMessage";

interface Client {
    socket: Socket;
    user: User;
}

export class ChatServer {

    private _server: Server;
    private _clients: Client[] = [];


    constructor(config: IServerConfig) {
        console.log(`Listening on port ${config.SOCKETIO_PORT}`);
        // const corsOrigin: string = `http://localhost:${config.SVELTE_PORT}`;
        const corsOrigin: string = `*`;
        this._server = new Server(config.SOCKETIO_PORT, {
            cors: {
                origin: corsOrigin,
            }
        });
        console.log(`Allow CORS of origin ${corsOrigin}`);
    }


    initConnections(): void {
        this._server.on('connection', socket => {
            this.addClient(socket);
            console.log(`+ User (${this._clients.length})`);

            socket.on('disconnect', reason => {
                const client: Client = this.removeClient(socket);
                console.log(`- User (${this._clients.length})`);
                if (client != null) {
                    console.log(`User ${JSON.stringify(client.user)} loggs out`);
                    if (client.user?.username?.trim().length > 0) {
                        const logoutMessage: LogoutMessage = {
                            user: client.user,
                            date: new Date(),
                        };
                        socket.broadcast.emit(SocketEventEnum.LOGOUT, logoutMessage);
                    }
                }
            });

            socket.on(SocketEventEnum.LOGIN, (loginMessage: LoginMessage): void => {
                socket.broadcast.emit(SocketEventEnum.LOGIN, loginMessage);
                socket.emit(SocketEventEnum.LOGIN, loginMessage);
                this.addUserToClient(socket, loginMessage.user);
                console.log(`User ${JSON.stringify(loginMessage.user)} loggs in`);
            });
            socket.on(SocketEventEnum.TEXT_MESSAGE, (textMessage: TextMessage) => {
                socket.broadcast.emit(SocketEventEnum.TEXT_MESSAGE, textMessage);
            });
        });
    }


    addClient(socket: Socket): Client {
        const client: Client = {
            socket,
            user: { username: "" },
        };
        this._clients.push(client);
        return client;
    }


    listen(): void {
        this.initConnections();
    }


    addUserToClient(socket: Socket, user: User): void {
        const client: Client = this.getClient(socket);
        client.user = user;
    }


    removeClient(socket: Socket): Client {
        const client: Client = this.getClient(socket);
        this._clients = this._clients.filter(c => c.socket !== socket);
        return client;
    }


    getClient(socket: Socket): Client {
        const client: Client | undefined = this._clients.find(c => c.socket === socket);
        if (client == null) {
            throw new Error(`Socket not found in client list!`);
        }
        return client;
    }
}
