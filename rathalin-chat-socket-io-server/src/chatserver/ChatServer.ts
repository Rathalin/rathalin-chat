import type { LoginMessage } from "../shared/message/login/LoginMessage";
import type { LogoutMessage } from "../shared/message/logout/LogoutMessage";
import type { Message } from "../shared/message/Message";
import type { UsernameAcceptMessage } from "../shared/message/login/UsernameAcceptMessage";
import type { UsernameTakenMessage } from "../shared/message/login/UsernameTakenMessage";
import { Server, Socket } from "socket.io";
import type { TextMessage } from "../shared/message/content/TextMessage";
import { MessageType } from "../shared/MessageType";
import type { Client } from "./interface/Client";
import { SocketEvent } from "../shared/SocketEvent";
import type { MessageListLimit } from "../shared/message/message-list/MessageListLimit";
import type { OnlineUserList } from "../shared/message/online-user-list/OnlineUserList";
import type { Chatroom } from "../shared/message/Chatroom";
import { ClientManager } from "./managers/ClientManager";
import { MessageManager } from "./managers/MessageManager";
import type { ChatroomMessage } from "src/shared/message/room/ChatroomMessage";


export class ChatServer {

    // Constructor

    // Members and Properties

    private server: Server | null = null;
    private readonly clientManager: ClientManager = new ClientManager();
    private readonly messageManager: MessageManager = new MessageManager();


    // Public Methods

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


    // Private Methods

    private initConnections(): void {
        if (this.server == null) return;

        this.server.on("connection", socket => {
            this.clientManager.addClient(socket);
            console.log(`+ User (${this.clientManager.clients.length})`);

            this.registerClientDisconnect(socket);
            this.registerClientRequestsLogin(socket);
            this.registerClientSendsTextMessage(socket);
            this.registerClientRequestsMessages(socket);
            this.registerClientRequestsOnlineUsers(socket);
            this.registerClientRequestsChatroomExisting(socket);
            this.registerClientRequestsNewChatroom(socket);
            this.registerClientRequestsJoinChatroom(socket);
        });
    }


    private registerClientDisconnect(socket: Socket): void {
        socket.on("disconnect", reason => {
            const client: Client = this.clientManager.removeClient(socket);
            console.log(`- User (${this.clientManager.clients.length})`);
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
                    this.messageManager.messages.push(logoutMessage);
                }
            }
        });


    }


    private registerClientRequestsLogin(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_LOGIN, (clientLoginMessage: LoginMessage): void => {
            if (clientLoginMessage.username.trim().length === 0) return;

            const usernameMaxLength: number = 100;
            const trimmedUsername: string = clientLoginMessage.username.trim().substring(0, usernameMaxLength);
            if (trimmedUsername.length === 0) return;

            if (this.clientManager.usernameTaken(trimmedUsername)) {
                const takenMessage: UsernameTakenMessage = {
                    event: SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_TAKEN,
                    type: MessageType.USERNAME_TAKEN,
                    date: new Date(),
                    username: trimmedUsername,
                };
                socket.emit(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_TAKEN, takenMessage);
                console.log(`  ! Taken Login "${takenMessage.username}"`);
            } else {
                const acceptMessage: UsernameAcceptMessage = {
                    event: SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT,
                    type: MessageType.USERNAME_ACCEPT,
                    date: new Date(),
                    username: trimmedUsername,
                };
                this.clientManager.setUsernameOfClient(socket, trimmedUsername);
                socket.emit(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT, acceptMessage);
                console.log(`    Accept Login "${acceptMessage.username}"`);
                const loginMessage: LoginMessage = {
                    event: SocketEvent.SERVER_SENDS_LOGIN,
                    type: MessageType.LOGIN,
                    date: new Date(),
                    username: trimmedUsername,
                };
                this.clientManager.addUserToClient(socket, { username: trimmedUsername });
                this.messageManager.addMessage(loginMessage);
                socket.broadcast.emit(SocketEvent.SERVER_SENDS_LOGIN, loginMessage);
            }
        });
    }


    private registerClientSendsTextMessage(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_SENDS_TEXT_MESSAGE, (clientTextMessage: TextMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const textMessage: TextMessage = {
                event: SocketEvent.SERVER_SENDS_TEXT_MESSAGE,
                type: MessageType.TEXT,
                date: new Date(),
                sender: clientTextMessage.sender,
                text: clientTextMessage.text,
            };
            socket.broadcast.emit(SocketEvent.SERVER_SENDS_TEXT_MESSAGE, textMessage);
            this.messageManager.addMessage(textMessage);
        });
    }


    private registerClientRequestsMessages(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_MESSAGE_LIST, (limit: MessageListLimit) => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendMessageListToClient(socket, limit.limit);
        });
    }


    private registerClientRequestsOnlineUsers(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_ONLINE_USERS, () => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendOnlineUsersToClient(socket);
        });
    }


    public registerClientRequestsChatroomExisting(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_CHATROOM_EXISTING, (chatroomMessage: ChatroomMessage) => {
            if (this.clientManager.chatroomExists(chatroomMessage.room)) {
                socket.emit(SocketEvent.SERVER_RESPONDS_CHATROOM_EXISTING);
            } else {
                socket.emit(SocketEvent.SERVER_RESPONDS_CHATROOM_NOT_EXISTING);
            }
        });
    }


    private registerClientRequestsNewChatroom(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_CREATE_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const room: Chatroom = chatroomMessage.room.trim();
            if (this.clientManager.chatroomExists(room)) {
                socket.emit(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_TAKEN);
            } else {
                this.clientManager.addChatroom(room);
                socket.emit(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_ACCEPT);
            }
        });
    }


    private registerClientRequestsJoinChatroom(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_JOIN_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const room: Chatroom = chatroomMessage.room.trim();
            if (this.clientManager.chatroomExists(room)) {
                this.clientManager.addClientToChatroom(this.clientManager.getClient(socket), room);
                socket.emit(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT);
            } else {
                socket.emit(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_NOT_EXISTING);
            }
        });
    }


    private sendMessageListToClient(socket: Socket, limit?: number): void {
        let messages: Message[];
        const existingMessage: Message[] = this.messageManager.messages;
        if (limit != null) {
            messages = existingMessage.slice(Math.max(0, existingMessage.length - limit), existingMessage.length);
        } else {
            messages = existingMessage;
        }
        console.log(`  Sending message in sequence (${existingMessage.length})`);
        messages
            .filter(msg => msg.type === MessageType.TEXT)
            .forEach(msg => socket.emit(msg.event, msg));
        // Send login 
        const loginMessage: LoginMessage = {
            event: SocketEvent.SERVER_SENDS_LOGIN,
            type: MessageType.LOGIN,
            date: new Date(),
            username: this.clientManager.getClient(socket).user.username,
        }
        socket.emit(SocketEvent.SERVER_SENDS_LOGIN, loginMessage);
    }


    private sendOnlineUsersToClient(socket: Socket): void {
        const onlineUsers: OnlineUserList = {
            event: SocketEvent.SERVER_RESPONDS_ONLINE_USERS,
            type: MessageType.ONLINE_USERS_LIST,
            date: new Date(),
            users: this.clientManager.clients.map(c => c.user.username),
        };
        socket.emit(SocketEvent.SERVER_RESPONDS_ONLINE_USERS, onlineUsers);
    }

}
