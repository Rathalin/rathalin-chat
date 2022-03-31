import { LoginMessage } from "$shared/messages/LoginMessage";
import { LogoutMessage } from "$shared/messages/LogoutMessage";
import { Message } from "$shared/messages/Message";
import { UsernameAcceptMessage } from "$shared/messages/UsernameAcceptMessage";
import { UsernameTakenMessage } from "$shared/messages/UsernameTakenMessage";
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
    private _messages: Message[] = [];


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
        // Connect
        this._server.on('connection', socket => {
            this.addClient(socket);
            console.log(`+ User (${this._clients.length})`);

            // Disconnect
            socket.on('disconnect', reason => {
                const client: Client = this.removeClient(socket);
                console.log(`- User (${this._clients.length})`);
                if (client != null) {
                    console.log(`User ${JSON.stringify(client.user)} loggs out (${reason})`);
                    if (client.user?.username?.trim().length > 0) {
                        const logoutMessage: LogoutMessage = {
                            type: SocketEventEnum.LOGOUT,
                            user: client.user,
                            date: new Date(),
                        };
                        socket.broadcast.emit(SocketEventEnum.LOGOUT, logoutMessage);
                        this._messages.push(logoutMessage);
                    }
                }
            });

            // Login
            socket.on(SocketEventEnum.LOGIN, (loginMessage: LoginMessage): void => {
                console.log("Login with ", loginMessage.user.username);
                if (loginMessage.user.username.trim().length === 0) return;

                const usernameMaxLength: number = 20;
                const trimmedUsername: string = loginMessage.user.username.trim().substring(0, usernameMaxLength);
                if (trimmedUsername.length === 0) return;

                if (this.usernameTaken(trimmedUsername)) {
                    const takenMessage: UsernameTakenMessage = {
                        type: SocketEventEnum.LOGIN_USERNAME_TAKEN,
                        date: new Date(),
                        username: trimmedUsername,
                    };
                    console.log(`Sending username taken: ${JSON.stringify(takenMessage)}`);
                    socket.emit(SocketEventEnum.LOGIN_USERNAME_TAKEN, takenMessage);
                } else {
                    const acceptMessage: UsernameAcceptMessage = {
                        type: SocketEventEnum.LOGIN_USERNAME_ACCEPT,
                        date: new Date(),
                        username: trimmedUsername,
                    };
                    this.setUsernameOfClient(socket, trimmedUsername);
                    console.log(`Sending username accepted: ${trimmedUsername}`);
                    socket.emit(SocketEventEnum.LOGIN_USERNAME_ACCEPT, acceptMessage);
                    socket.broadcast.emit(SocketEventEnum.LOGIN, loginMessage);
                    this.sendAllMessagesToClient(socket);
                }

                socket.broadcast.emit(SocketEventEnum.LOGIN, loginMessage);
                socket.emit(SocketEventEnum.LOGIN, loginMessage);
                this.addUserToClient(socket, loginMessage.user);
                console.log(`User ${JSON.stringify(loginMessage.user)} loggs in`);
            });

            // Text message
            socket.on(SocketEventEnum.TEXT_MESSAGE, (textMessage: TextMessage) => {
                if (!this.hasValidUsername(socket)) return;
                socket.broadcast.emit(SocketEventEnum.TEXT_MESSAGE, textMessage);
            });
        });
    }


    listen(): void {
        this.initConnections();
    }


    addClient(socket: Socket): Client {
        const client: Client = {
            socket,
            user: { username: "" },
        };
        this._clients.push(client);
        return client;
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


    setUsernameOfClient(socket: Socket, username: string) {
        const user: User = this.getClient(socket).user;
        console.log(`${user.username} -> ${username}`)
        user.username = username;
    }


    usernameTaken(username: string): boolean {
        return this._clients
            .some(client => client.user.username.toLocaleLowerCase() === username.toLocaleLowerCase());
    }


    hasValidUsername(socket: Socket): boolean {
        const client: Client = this.getClient(socket);
        console.log("Textmessage from " + client.user.username);
        return client.user.username.length > 0;
    }


    sendAllMessagesToClient(socket: Socket): void {
        this._messages.forEach(msg => socket.emit(msg.type, msg));
    }

}
