import type { LoginMessage } from "./shared/messages/LoginMessage";
import type { LogoutMessage } from "./shared/messages/LogoutMessage";
import type { Message } from "./shared/messages/Message";
import type { UsernameAcceptMessage } from "./shared/messages/UsernameAcceptMessage";
import type { UsernameTakenMessage } from "./shared/messages/UsernameTakenMessage";
import { Server, Socket } from "socket.io";
import type { TextMessage } from "./shared/messages/TextMessage";
import { MessageType } from "./shared/MessageType";
import type { Client } from "./interfaces/Client";
import type { User } from "./interfaces/User";
import { SocketEvent } from "./shared/SocketEvent";


export class ChatServer {

    private server: Server | null = null;
    private clients: Client[] = [];
    private messages: Message[] = [];


    constructor() {
    }


    public listen(socketIOPort: number, corsPort: number | "*"): void {
        console.log(`Listening on port ${socketIOPort}`);
        const corsOrigin: string = corsPort === "*" ? corsPort : `http://localhost:${corsPort}`;
        this.server = new Server(socketIOPort, {
            cors: {
                origin: corsOrigin,
            }
        });
        console.log(`Allow CORS of origin ${corsOrigin}`);
        this.initConnections();
    }


    private initConnections(): void {
        if (this.server == null) return;

        this.server.on("connection", socket => {
            this.addClient(socket);
            console.log(`+ User (${this.clients.length})`);

            this.registerClientDisconnect(socket);
            this.registerClientRequestsLogin(socket);
            this.registerClientSendsTextMessage(socket);
            this.registerClientRequestsMessages(socket);
        });
    }


    private registerClientDisconnect(socket: Socket): void {
        socket.on("disconnect", reason => {
            const client: Client = this.removeClient(socket);
            console.log(`- User (${this.clients.length})`);
            if (client != null) {
                console.log(`    Logout ${JSON.stringify(client.user)}`);
                if (client.user?.username?.trim().length > 0) {
                    const logoutMessage: LogoutMessage = {
                        event: SocketEvent.SERVER_SENDS_LOGOUT,
                        type: MessageType.LOGOUT,
                        username: client.user.username,
                        date: new Date(),
                    };
                    socket.broadcast.emit(SocketEvent.SERVER_SENDS_LOGOUT, logoutMessage);
                    this.messages.push(logoutMessage);
                }
            }
        });
    }


    private registerClientRequestsLogin(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_LOGIN, (loginMessage: LoginMessage): void => {
            if (loginMessage.username.trim().length === 0) return;

            const usernameMaxLength: number = 20;
            const trimmedUsername: string = loginMessage.username.trim().substring(0, usernameMaxLength);
            if (trimmedUsername.length === 0) return;

            if (this.usernameTaken(trimmedUsername)) {
                const takenMessage: UsernameTakenMessage = {
                    event: SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_TAKEN,
                    type: MessageType.USERNAME,
                    date: new Date(),
                    username: trimmedUsername,
                };
                socket.emit(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_TAKEN, takenMessage);
                console.log(`  ! Taken Login "${takenMessage.username}"`);
            } else {
                const acceptMessage: UsernameAcceptMessage = {
                    event: SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT,
                    type: MessageType.USERNAME,
                    date: new Date(),
                    username: trimmedUsername,
                };
                this.setUsernameOfClient(socket, trimmedUsername);
                socket.emit(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT, acceptMessage);
                console.log(`    Accept Login "${acceptMessage.username}"`);
                this.addUserToClient(socket, { username: loginMessage.username });
                this.messages.push(loginMessage);

                socket.broadcast.emit(SocketEvent.SERVER_SENDS_LOGIN, loginMessage);
                this.sendAllMessagesToClient(socket);
            }
        });
    }


    private registerClientSendsTextMessage(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_SENDS_TEXT_MESSAGE, (clientTextMessage: TextMessage) => {
            if (!this.authUser(socket)) return;
            clientTextMessage.event = SocketEvent.SERVER_SENDS_TEXT_MESSAGE;
            socket.broadcast.emit(SocketEvent.SERVER_SENDS_TEXT_MESSAGE, clientTextMessage);
            this.messages.push(clientTextMessage);
        });
    }


    private registerClientRequestsMessages(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_MESSAGES, (limit?: number) => {
            if (!this.authUser(socket)) return;
            console.log(`  Send ${this.messages.length} messages`);
            let messages: Message[];
            if (limit != null && this.messages.length > limit) {
                messages = this.messages.slice(0, limit);
            } else {
                messages = this.messages;
            }

            messages.forEach(msg => socket.emit(msg.type, msg));
        });
    }


    private addClient(socket: Socket): Client {
        const client: Client = {
            socket,
            user: { username: "" },
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


    private authUser(socket: Socket): boolean {
        return this.hasValidUsername(socket);
    }


    private hasValidUsername(socket: Socket): boolean {
        return this.getClient(socket).user.username.length > 0;
    }


    private sendAllMessagesToClient(socket: Socket): void {
        console.log(`  Textmessages ${this.messages.length}`);
        this.messages.forEach(msg => socket.emit(msg.type, msg));
    }

}
