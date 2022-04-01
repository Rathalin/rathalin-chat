import { LoginMessage } from '$shared/messages/LoginMessage';
import { LogoutMessage } from '$shared/messages/LogoutMessage';
import { Message } from '$shared/messages/Message';
import { UsernameAcceptMessage } from '$shared/messages/UsernameAcceptMessage';
import { UsernameTakenMessage } from '$shared/messages/UsernameTakenMessage';
import { User } from '$shared/user/User';
import { Server, Socket } from 'socket.io';
import { IServerConfig } from './interfaces/IServerConfig';
import { SocketEventEnum } from './shared/events/SocketEventEnum';
import { TextMessage } from './shared/messages/TextMessage';

interface Client {
    socket: Socket;
    user: User;
}

export class ChatServer {

    private server: Server | null = null;
    private clients: Client[] = [];
    private messages: Message[] = [];


    constructor(private readonly config: IServerConfig) {
    }


    public listen(): void {
        console.log(`Listening on port ${this.config.SOCKETIO_PORT}`);
        // const corsOrigin: string = `http://localhost:${config.SVELTE_PORT}`;
        const corsOrigin: string = `*`;
        this.server = new Server(this.config.SOCKETIO_PORT, {
            cors: {
                origin: corsOrigin,
            }
        });
        console.log(`Allow CORS of origin ${corsOrigin}`);
        this.initConnections();
    }


    private initConnections(): void {
        if (this.server == null) return;

        // Connect
        this.server.on('connection', socket => {
            this.addClient(socket);
            console.log(`+ User (${this.clients.length})`);

            // Disconnect
            socket.on('disconnect', reason => {
                const client: Client = this.removeClient(socket);
                console.log(`- User (${this.clients.length})`);
                if (client != null) {
                    console.log(`User ${JSON.stringify(client.user)} loggs out (${reason})`);
                    if (client.user?.username?.trim().length > 0) {
                        const logoutMessage: LogoutMessage = {
                            type: SocketEventEnum.LOGOUT,
                            user: client.user,
                            date: new Date(),
                        };
                        socket.broadcast.emit(SocketEventEnum.LOGOUT, logoutMessage);
                        this.messages.push(logoutMessage);
                    }
                }
            });

            // Login
            socket.on(SocketEventEnum.LOGIN, (loginMessage: LoginMessage): void => {
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
                    socket.emit(SocketEventEnum.LOGIN_USERNAME_TAKEN, takenMessage);
                    console.log(`  ! Taken Login "${takenMessage.username}"`);
                } else {
                    const acceptMessage: UsernameAcceptMessage = {
                        type: SocketEventEnum.LOGIN_USERNAME_ACCEPT,
                        date: new Date(),
                        username: trimmedUsername,
                    };
                    this.setUsernameOfClient(socket, trimmedUsername);
                    socket.emit(SocketEventEnum.LOGIN_USERNAME_ACCEPT, acceptMessage);
                    console.log(`    Accept Login "${acceptMessage.username}"`);
                    this.addUserToClient(socket, loginMessage.user);
                    this.messages.push(loginMessage);

                    socket.broadcast.emit(SocketEventEnum.LOGIN, loginMessage);
                    this.sendAllMessagesToClient(socket);
                }
            });

            // Text message
            socket.on(SocketEventEnum.TEXT_MESSAGE, (textMessage: TextMessage) => {
                if (!this.hasValidUsername(socket)) return;
                socket.broadcast.emit(SocketEventEnum.TEXT_MESSAGE, textMessage);
                this.messages.push(textMessage);
            });
        });
    }


    private addClient(socket: Socket): Client {
        const client: Client = {
            socket,
            user: { username: '' },
        };
        this.clients.push(client);
        return client;
    }


    private addUserToClient(socket: Socket, user: User): void {
        const client: Client = this.getClient(socket);
        client.user = user;
    }


    private removeClient(socket: Socket): Client {
        const client: Client = this.getClient(socket);
        this.clients = this.clients.filter(c => c.socket !== socket);
        return client;
    }


    private getClient(socket: Socket): Client {
        const client: Client | undefined = this.clients.find(c => c.socket === socket);
        if (client == null) {
            throw new Error(`Socket not found in client list!`);
        }
        return client;
    }


    private setUsernameOfClient(socket: Socket, username: string) {
        const user: User = this.getClient(socket).user;
        user.username = username;
    }


    private usernameTaken(username: string): boolean {
        return this.clients
            .some(client => client.user.username.toLocaleLowerCase() === username.toLocaleLowerCase());
    }


    private hasValidUsername(socket: Socket): boolean {
        const client: Client = this.getClient(socket);
        return client.user.username.length > 0;
    }


    private sendAllMessagesToClient(socket: Socket): void {
        this.messages.forEach(msg => socket.emit(msg.type, msg));
    }

}
