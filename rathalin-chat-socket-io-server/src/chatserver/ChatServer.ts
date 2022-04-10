import type { LoginMessage } from "../shared/message/user/UsernameMessagessage";
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
import type { OnlineUserList } from "../shared/message/user/UsernameList";
import type { Chatroom } from "../shared/message/room/Chatroomtroom";
import { ClientManager } from "./managers/ClientManager";
import { MessageManager } from "./managers/MessageManager";
import type { ChatroomMessage } from "src/shared/message/room/ChatroomMessage";


function log(message: string, event?: string): void {
    const context: string = event ?? "CORE"
    const serverTag: string = "chat-server";
    console.log(`[${new Date().toLocaleTimeString()}][${serverTag.toUpperCase()}][${context.toUpperCase()}] ${message}`);
}

export class ChatServer {

    // Constructor

    // Members and Properties

    private server: Server | null = null;
    private readonly clientManager: ClientManager = new ClientManager();
    private readonly messageManager: MessageManager = new MessageManager();


    // Public Methods

    public listen(socketIOPort: number, corsPort: number | "*"): void {
        log(`Listening on port ${socketIOPort}`);
        const corsOrigin: string = corsPort === "*" ? corsPort : `http://localhost:${corsPort}`;
        this.server = new Server(socketIOPort, {
            cors: {
                origin: corsOrigin,
            }
        });
        log(`Allow CORS of origin ${corsOrigin}`);
        this.initConnections();
    }


    // Private Methods

    private initConnections(): void {
        if (this.server == null) return;

        this.server.on("connection", socket => {
            this.clientManager.addClient(socket);
            log(`+ User (${this.clientManager.clients.length})`, "connect");

            this.registerClientDisconnect(socket);
            this.registerClientRequestsLogin(socket);
            this.registerClientRequestsChatroomExisting(socket);
            this.registerClientRequestsNewChatroom(socket);
            this.registerClientRequestsJoinChatroom(socket);
        });
    }


    private registerClientDisconnect(socket: Socket): void {
        socket.on("disconnect", reason => {
            const client: Client = this.clientManager.removeClient(socket);
            log(`- User (${this.clientManager.clients.length})`, "disconnect");
            if (client != null) {
                log(`Logout ${JSON.stringify(client.user)}`, SocketEvent.SERVER_SENDS_LOGOUT);
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
                log(`Taken Login "${takenMessage.username}"`, SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_TAKEN);
            } else {
                const acceptMessage: UsernameAcceptMessage = {
                    event: SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT,
                    type: MessageType.USERNAME_ACCEPT,
                    date: new Date(),
                    username: trimmedUsername,
                };
                this.clientManager.setUsernameOfClient(socket, trimmedUsername);
                socket.emit(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT, acceptMessage);
                log(`Accept Login "${acceptMessage.username}"`, SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT);
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


    private registerClientToRoom(socket: Socket, room: Chatroom): void {
        this.registerClientSendsTextMessage(socket, room);
        this.registerClientRequestsMessages(socket, room);
        this.registerClientRequestsOnlineUsers(socket, room);
        this.registerClientRequestsLeaveRoom(socket, room);
    }


    private registerClientSendsTextMessage(socket: Socket, room: Chatroom): void {
        socket.on(SocketEvent.CLIENT_SENDS_TEXT_MESSAGE, (clientTextMessage: TextMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const textMessage: TextMessage = {
                event: SocketEvent.SERVER_SENDS_TEXT_MESSAGE,
                type: MessageType.TEXT,
                date: new Date(),
                sender: clientTextMessage.sender,
                text: clientTextMessage.text,
            };
            socket.broadcast.to(room).emit(SocketEvent.SERVER_SENDS_TEXT_MESSAGE, textMessage);
            this.messageManager.addMessage(textMessage);
        });
    }


    private registerClientRequestsMessages(socket: Socket, room: Chatroom): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_MESSAGE_LIST, (limit: MessageListLimit) => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendMessageListToClient(socket, room, limit.limit);
        });
    }


    private registerClientRequestsOnlineUsers(socket: Socket, room: Chatroom): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_ONLINE_USERS, () => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendOnlineUsersToClient(socket, room);
        });
    }


    private registerClientRequestsLeaveRoom(socket: Socket, room: Chatroom): void {
        // socket.on(SocketEvent.);
    }


    public registerClientRequestsChatroomExisting(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_CHATROOM_EXISTS, (chatroomMessage: ChatroomMessage) => {
            if (this.clientManager.chatroomExists(chatroomMessage.room)) {
                log(`Sending chatroom "${chatroomMessage.room}" does not exist.`, SocketEvent.SERVER_RESPONDS_CHATROOM_EXISTS);
                socket.emit(SocketEvent.SERVER_RESPONDS_CHATROOM_EXISTS);
            } else {
                log(`Sending chatroom "${chatroomMessage.room}" does exist.`, SocketEvent.SERVER_RESPONDS_CHATROOM_NOT_EXISTS);
                socket.emit(SocketEvent.SERVER_RESPONDS_CHATROOM_NOT_EXISTS);
            }
        });
    }


    private registerClientRequestsNewChatroom(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_CREATE_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const room: Chatroom = chatroomMessage.room.trim();
            if (this.clientManager.chatroomExists(room)) {
                log(`Sending chatroom "${chatroomMessage.room}" can't be created.`, SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_TAKEN);
                socket.emit(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_TAKEN);
            } else {
                this.clientManager.addChatroom(room);
                log(`Sending chatroom "${chatroomMessage.room}" was created.`, SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_ACCEPT);
                socket.emit(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_ACCEPT);
            }
        });
    }


    private registerClientRequestsJoinChatroom(socket: Socket): void {
        socket.on(SocketEvent.CLIENT_REQUESTS_JOIN_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const room: Chatroom = chatroomMessage.room.trim();
            if (this.clientManager.chatroomExists(room)) {
                this.clientManager.addClientToChatroom(socket, room);
                log(`Sending join chatroom "${chatroomMessage.room}" accept.`, SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT);
                socket.emit(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT);
            } else {
                log(`Sending join chatroom "${chatroomMessage.room}" not accept.`, SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_NOT_EXISTING);
                socket.emit(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_NOT_EXISTING);
                socket.join(room);
                this.registerClientToRoom(socket, room);
            }
        });
    }


    private sendMessageListToClient(socket: Socket, room: Chatroom, limit?: number): void {
        let messages: Message[];
        const existingMessage: Message[] = this.messageManager.messages;
        if (limit != null) {
            messages = existingMessage.slice(Math.max(0, existingMessage.length - limit), existingMessage.length);
        } else {
            messages = existingMessage;
        }
        log(`Sending message in sequence (${existingMessage.length})`, "SERVER_SENDS_MESSAGES");
        messages
            .filter(msg => msg.type === MessageType.TEXT)
            .forEach(msg => socket.to(room).emit(msg.event, msg));
        // Send login 
        const loginMessage: LoginMessage = {
            event: SocketEvent.SERVER_SENDS_LOGIN,
            type: MessageType.LOGIN,
            date: new Date(),
            username: this.clientManager.getClient(socket).user.username,
        }
        socket.to(room).emit(SocketEvent.SERVER_SENDS_LOGIN, loginMessage);
    }


    private sendOnlineUsersToClient(socket: Socket, room: Chatroom): void {
        const onlineUsers: OnlineUserList = {
            event: SocketEvent.SERVER_RESPONDS_ONLINE_USERS,
            type: MessageType.ONLINE_USERS_LIST,
            date: new Date(),
            users: this.clientManager.clients.map(c => c.user.username),
        };
        log(`Sending online users (${onlineUsers.users.length})`, SocketEvent.SERVER_RESPONDS_ONLINE_USERS);
        socket.to(room).emit(SocketEvent.SERVER_RESPONDS_ONLINE_USERS, onlineUsers);
    }
}
