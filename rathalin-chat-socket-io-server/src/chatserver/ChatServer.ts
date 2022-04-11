import type { Message } from "../shared/message/Message";
import { Server, Socket } from "socket.io";
import type { Client } from "./interface/Client";
import { ClientManager } from "./managers/ClientManager";
import { MessageManager } from "./managers/MessageManager";
import { ClientEvent } from "../shared/ClientEvent";
import { ServerEvent } from "../shared/ServerEvent";
import { MessageType } from "../shared/MessageType";
import type { TextMessage } from "../shared/message/content/TextMessage";
import type { ChatroomMessage } from "../shared/message/room/ChatroomMessage";
import type { UsernameMessage } from "../shared/message/user/UsernameMessage";
import type { Username } from "../shared/message/user/Username";
import type { Chatroom } from "../shared/message/room/Chatroom";
import type { MessageListMessage } from "../shared/message/content/MessageList";
import type { UsernameListMessage } from "../shared/message/user/UsernameList";
import { Logger } from "../logger";

export class ChatServer {

    // Constructor

    // Members and Properties

    private server: Server | null = null;
    private readonly clientManager: ClientManager = new ClientManager();
    private readonly messageManager: MessageManager = new MessageManager();
    private readonly logger: Logger = new Logger("chat-server");


    // Public Methods

    public listen(socketIOPort: number, corsPort: number | "*"): void {
        this.logger.log(`Listening on port ${socketIOPort}`);
        const corsOrigin: string = corsPort === "*" ? corsPort : `http://localhost:${corsPort}`;
        this.server = new Server(socketIOPort, {
            cors: {
                origin: corsOrigin,
            }
        });
        this.logger.log(`Allow CORS of origin ${corsOrigin}`);
        this.initConnections();
    }


    // Private Methods

    private initConnections(): void {
        if (this.server == null) return;

        this.server.on("connection", socket => {
            this.clientManager.addClient(socket);
            this.logger.log(`+ User (${this.clientManager.clients.length})`, "connect");

            this.registerClientDisconnect(socket);
            this.registerClientRequestsLogin(socket);
            this.registerClientRequestsChatroomExisting(socket);
            this.registerClientRequestsCreateChatroom(socket);
            this.registerClientRequestsJoinChatroom(socket);
        });
    }


    private registerClientDisconnect(socket: Socket): void {
        socket.on("disconnect", reason => {
            const client: Client = this.clientManager.removeClient(socket);
            this.logger.log(`- User (${this.clientManager.clients.length})`, "disconnect");
            if (client != null) {
                this.logger.log(`Logout ${JSON.stringify(client.user)}`, ServerEvent.SEND_LOGOUT);
                if (client.user?.username?.trim().length > 0) {
                    const usernameMessage: UsernameMessage = {
                        event: ServerEvent.SEND_LOGOUT,
                        type: MessageType.USERNAME,
                        username: client.user.username,
                        date: new Date().toString(),
                    };
                    socket.broadcast.emit(ServerEvent.SEND_LOGOUT, usernameMessage);
                    this.messageManager.messages.push(usernameMessage);
                }
            }
        });


    }


    private registerClientRequestsLogin(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_LOGIN, (usernameMessage: UsernameMessage): void => {
            const usernameMaxLength: number = 100;
            const username: Username = usernameMessage.username.trim().substring(0, usernameMaxLength);
            if (username.length === 0) return;

            if (this.clientManager.usernameTaken(username)) {
                socket.emit(ServerEvent.RESPONSE_LOGIN_USERNAME_TAKEN);
                this.logger.log(`Taken Login "${username}"`, ServerEvent.RESPONSE_LOGIN_USERNAME_TAKEN);
            } else {
                this.clientManager.setUsernameOfClient(socket, username);
                socket.emit(ServerEvent.RESPONSE_LOGIN_USERNAME_ACCEPT);
                this.logger.log(`Accept Login "${username}"`, ServerEvent.RESPONSE_LOGIN_USERNAME_ACCEPT);
                const loginMessage: UsernameMessage = {
                    event: ServerEvent.SEND_LOGIN,
                    type: MessageType.USERNAME,
                    date: new Date().toString(),
                    username,
                };
                this.clientManager.addUserToClient(socket, { username });
                this.messageManager.addMessage(loginMessage);
                socket.broadcast.emit(ServerEvent.SEND_LOGIN, loginMessage);
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
        socket.on(ClientEvent.SEND_TEXT_MESSAGE, (clientTextMessage: TextMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const textMessage: TextMessage = {
                event: ServerEvent.SEND_TEXT_MESSAGE,
                type: MessageType.TEXT,
                date: clientTextMessage.date,
                sender: clientTextMessage.sender,
                text: clientTextMessage.text,
            };
            socket.broadcast.to(room).emit(ServerEvent.SEND_TEXT_MESSAGE, textMessage);
            this.messageManager.addMessage(textMessage);
        });
    }


    private registerClientRequestsMessages(socket: Socket, room: Chatroom): void {
        socket.on(ClientEvent.REQUEST_MESSAGE_LIST, (limit?: number) => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendMessageListToClient(socket, room, limit);
        });
    }


    private registerClientRequestsOnlineUsers(socket: Socket, room: Chatroom): void {
        socket.on(ClientEvent.REQUEST_ONLINE_USERS, () => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendOnlineUsersToClient(socket, room);
        });
    }


    private registerClientRequestsLeaveRoom(socket: Socket, room: Chatroom): void {
        // socket.on(SocketEvent.);
    }


    public registerClientRequestsChatroomExisting(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_CHATROOM_EXISTS, (chatroomMessage: ChatroomMessage) => {
            if (this.clientManager.chatroomExists(chatroomMessage.room)) {
                socket.emit(ServerEvent.RESPONSE_CHATROOM_EXISTS);
                this.logger.log(`Chatroom "${chatroomMessage.room}" does not exist.`, ServerEvent.RESPONSE_CHATROOM_EXISTS);
            } else {
                socket.emit(ServerEvent.RESPONSE_CHATROOM_NOT_EXISTS);
                this.logger.log(`Chatroom "${chatroomMessage.room}" does exist.`, ServerEvent.RESPONSE_CHATROOM_NOT_EXISTS);
            }
        });
    }


    private registerClientRequestsCreateChatroom(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_CREATE_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const room: Chatroom = chatroomMessage.room.trim();
            if (!this.clientManager.chatroomExists(room)) {
                this.clientManager.addChatroom(room);
                socket.emit(ServerEvent.RESPONSE_CREATE_CHATROOM_ACCEPT);
                this.logger.log(`Chatroom "${chatroomMessage.room}" was created.`, ServerEvent.RESPONSE_CREATE_CHATROOM_ACCEPT);
            } else {
                socket.emit(ServerEvent.RESPONSE_CREATE_CHATROOM_TAKEN);
                this.logger.log(`Chatroom "${chatroomMessage.room}" not created because taken.`, ServerEvent.RESPONSE_CREATE_CHATROOM_TAKEN);
            }
        });
    }


    private registerClientRequestsJoinChatroom(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_JOIN_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const room: Chatroom = chatroomMessage.room.trim();
            if (this.clientManager.chatroomExists(room)) {
                this.clientManager.addClientToChatroom(socket, room);
                socket.join(room);
                this.registerClientToRoom(socket, room);
                socket.emit(ServerEvent.RESPONSE_JOIN_CHATROOM_ACCEPT);
                this.logger.log(`Join chatroom "${chatroomMessage.room}" accept.`, ServerEvent.RESPONSE_JOIN_CHATROOM_ACCEPT);
            } else {
                socket.emit(ServerEvent.RESPONSE_JOIN_CHATROOM_NOT_EXISTING);
                this.logger.log(`Join chatroom "${chatroomMessage.room}" not accepted, because not existing.`, ServerEvent.RESPONSE_JOIN_CHATROOM_NOT_EXISTING);

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
        this.logger.log(`Sending message in sequence (${existingMessage.length})`, "SERVER_SENDS_MESSAGES");
        const allTextMessages: TextMessage[] = messages.filter(msg => msg.type === MessageType.TEXT) as TextMessage[];
        const loginMessageOfClient: UsernameMessage = {
            event: ServerEvent.SEND_LOGIN,
            type: MessageType.USERNAME,
            date: new Date().toString(),
            username: this.clientManager.getClient(socket).user.username,
        }
        const messageList: MessageListMessage = {
            event: ServerEvent.RESPONSE_MESSAGE_LIST,
            type: MessageType.MESSAGE_LIST,
            date: new Date().toString(),
            messages: [
                ...allTextMessages,
                loginMessageOfClient
            ],
        }
        socket.to(room).emit(ServerEvent.RESPONSE_MESSAGE_LIST, messageList);
    }


    private sendOnlineUsersToClient(socket: Socket, room: Chatroom): void {
        const onlineUsersMessage: UsernameListMessage = {
            event: ServerEvent.RESPONSE_ONLINE_USERS,
            type: MessageType.USERNAME_LIST,
            date: new Date().toString(),
            users: this.clientManager.clients.map(c => c.user.username),
        };
        this.logger.log(`Online users (${onlineUsersMessage.users.length})`, ServerEvent.RESPONSE_ONLINE_USERS);
        socket.to(room).emit(ServerEvent.RESPONSE_ONLINE_USERS, onlineUsersMessage);
    }
}
