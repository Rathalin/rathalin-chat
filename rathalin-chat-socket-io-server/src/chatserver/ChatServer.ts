import type { Message } from "../shared/message/Message";
import { Server, Socket } from "socket.io";
import type { Client } from "./interface/Client";
import { ClientManager } from "./managers/ClientManager";
import { ClientEvent } from "../shared/ClientEvent";
import { ServerEvent } from "../shared/ServerEvent";
import { MessageType } from "../shared/MessageType";
import type { TextMessage } from "../shared/message/content/TextMessage";
import type { ChatroomMessage } from "../shared/message/room/ChatroomMessage";
import type { UsernameMessage } from "../shared/message/user/UsernameMessage";
import type { Username } from "../shared/message/user/Username";
import type { ChatroomName } from "../shared/message/room/ChatroomName";
import type { MessageListMessage } from "../shared/message/content/MessageList";
import type { UsernameListMessage } from "../shared/message/user/UsernameList";
import { Logger } from "../logger";

export class ChatServer {

    // Constructor

    constructor(
        private readonly usernameMaxLength: number = 30,
        private readonly roomNameMaxLength: number = 30,
        private readonly chatroomLimit: number = 500,
        private readonly messageLimitPerChatroom: number = 1000,
    ) {
        this.clientManager = new ClientManager(this.chatroomLimit, this.messageLimitPerChatroom)
    }

    // Members and Properties

    private server: Server | null = null;
    private readonly clientManager: ClientManager;
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
        if (this.server == null) throw new Error("Initialize Server by calling 'listen'!");

        this.server.on("connection", socket => {
            this.clientManager.addClient(socket);
            this.logger.log(`+ User (${this.clientManager.numberOfClients})`, "connect");

            this.registerClientDisconnect(socket);
            this.registerClientRequestsLogin(socket);
            this.registerClientRequestsChatroomExisting(socket);
            this.registerClientRequestsCreateChatroom(socket);
            this.registerClientRequestsJoinChatroom(socket);
            this.registerClientRequestsLeaveChatroom(socket);
        });
    }


    private registerClientDisconnect(socket: Socket): void {
        socket.on("disconnect", reason => {
            const client: Client = this.clientManager.getClientBySocket(socket);
            this.logger.log(`- User (${this.clientManager.numberOfClients - 1}) (Reason: ${reason})`, "disconnect");
            if (client.user?.username?.trim()) {
                const userLeavingChatroomMessage: UsernameMessage = {
                    event: ServerEvent.SEND_LEAVE_CHATROOM,
                    type: MessageType.USERNAME,
                    date: new Date().toString(),
                    username: client.user.username,
                }
                const roomesOfClient: string[] = this.clientManager.getChatroomNamesOfClient(socket);
                if (roomesOfClient.length > 0) {
                    socket.to(roomesOfClient).emit(ServerEvent.SEND_LEAVE_CHATROOM, userLeavingChatroomMessage);
                }
            }
            this.clientManager.removeClient(socket);
        });
    }


    private registerClientRequestsLogin(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_LOGIN, (usernameMessage: UsernameMessage): void => {
            const username: Username = usernameMessage.username.trim().substring(0, this.usernameMaxLength);
            if (username.length === 0) return;

            if (this.clientManager.usernameTaken(username)) {
                socket.emit(ServerEvent.RESPONSE_LOGIN_USERNAME_TAKEN);
                this.logger.log(`Taken Login "${username}"`, ServerEvent.RESPONSE_LOGIN_USERNAME_TAKEN);
            } else {
                this.clientManager.setUsernameOfClient(socket, username);
                socket.emit(ServerEvent.RESPONSE_LOGIN_USERNAME_ACCEPT);
                this.logger.log(`Accept Login "${username}"`, ServerEvent.RESPONSE_LOGIN_USERNAME_ACCEPT);
                this.clientManager.addUserToClient(socket, { username });
            }
        });
    }


    private registerClientToRoom(socket: Socket, roomName: ChatroomName): void {
        this.registerClientRequestsOnlineUserList(socket, roomName);
        this.registerClientRequestsMessageList(socket, roomName);
        this.registerClientSendsTextMessage(socket, roomName);
    }


    private unregisterClientFromRoom(socket: Socket): void {
        this.unregisterClientRequestsOnlineUserList(socket);
        this.unregisterClientRequestsMessageList(socket);
        this.unregisterClientSendsTextMessage(socket);
    }


    private registerClientSendsTextMessage(socket: Socket, roomName: ChatroomName): void {
        socket.on(ClientEvent.SEND_TEXT_MESSAGE, (clientTextMessage: TextMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const textMessage: TextMessage = {
                event: ServerEvent.SEND_TEXT_MESSAGE,
                type: MessageType.TEXT,
                date: clientTextMessage.date,
                sender: clientTextMessage.sender,
                text: clientTextMessage.text,
            };
            socket.broadcast.to(roomName).emit(ServerEvent.SEND_TEXT_MESSAGE, textMessage);
            this.clientManager.addMessagesToChatroom(roomName, textMessage);
        });
    }


    private unregisterClientSendsTextMessage(socket: Socket): void {
        socket.removeAllListeners(ClientEvent.SEND_TEXT_MESSAGE);
    }


    private registerClientRequestsMessageList(socket: Socket, roomName: ChatroomName): void {
        socket.on(ClientEvent.REQUEST_MESSAGE_LIST, (limit?: number) => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendMessageListToClient(socket, roomName, limit);
        });
    }


    private unregisterClientRequestsMessageList(socket: Socket): void {
        socket.removeAllListeners(ClientEvent.REQUEST_MESSAGE_LIST);
    }


    private registerClientRequestsOnlineUserList(socket: Socket, roomName: ChatroomName): void {
        socket.on(ClientEvent.REQUEST_ONLINE_USERS, () => {
            if (!this.clientManager.authUser(socket)) return;
            this.sendOnlineUsersToClient(socket, roomName);
        });
    }


    private unregisterClientRequestsOnlineUserList(socket: Socket): void {
        socket.removeAllListeners(ClientEvent.REQUEST_ONLINE_USERS);
    }


    private registerClientRequestsChatroomExisting(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_CHATROOM_EXISTS, (chatroomMessage: ChatroomMessage) => {
            if (this.clientManager.chatroomExists(chatroomMessage.room)) {
                socket.emit(ServerEvent.RESPONSE_CHATROOM_EXISTS);
                this.logger.log(`Chatroom "${chatroomMessage.room}" does exist.`, ServerEvent.RESPONSE_CHATROOM_EXISTS);
            } else {
                socket.emit(ServerEvent.RESPONSE_CHATROOM_NOT_EXISTS);
                this.logger.log(`Chatroom "${chatroomMessage.room}" does not exist.`, ServerEvent.RESPONSE_CHATROOM_NOT_EXISTS);
            }
        });
    }


    private registerClientRequestsCreateChatroom(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_CREATE_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const roomName: ChatroomName = chatroomMessage.room.trim();
            if (this.clientManager.chatroomLimitReached()) {
                socket.emit(ServerEvent.RESPONSE_CHATROOM_LIMIT_REACHED);
                this.logger.log(`Chatroom limit of ${this.chatroomLimit} reached.`, ServerEvent.RESPONSE_CHATROOM_LIMIT_REACHED);
                return;
            }
            if (this.clientManager.chatroomExists(roomName)) {
                socket.emit(ServerEvent.RESPONSE_CREATE_CHATROOM_TAKEN);
                this.logger.log(`Chatroom "${chatroomMessage.room}" not created because taken.`, ServerEvent.RESPONSE_CREATE_CHATROOM_TAKEN);
                return;
            }
            this.clientManager.addChatroom(roomName);
            socket.emit(ServerEvent.RESPONSE_CREATE_CHATROOM_ACCEPT);
            this.logger.log(`Chatroom "${chatroomMessage.room}" was created.`, ServerEvent.RESPONSE_CREATE_CHATROOM_ACCEPT);
        });
    }


    private registerClientRequestsJoinChatroom(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_JOIN_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const roomName: ChatroomName = chatroomMessage.room.trim().substring(0, this.roomNameMaxLength);
            if (roomName.length === 0) return;
            if (this.clientManager.chatroomExists(roomName)) {
                this.clientManager.addClientToChatroom(socket, roomName);
                socket.join(roomName);
                this.registerClientToRoom(socket, roomName);
                socket.emit(ServerEvent.RESPONSE_JOIN_CHATROOM_ACCEPT);
                this.logger.log(`Join chatroom "${chatroomMessage.room}" accept.`, ServerEvent.RESPONSE_JOIN_CHATROOM_ACCEPT);
                const userJoiningChatroomMessage: UsernameMessage = {
                    event: ServerEvent.SEND_JOIN_CHATROOM,
                    type: MessageType.USERNAME,
                    date: new Date().toString(),
                    username: this.clientManager.getClientBySocket(socket).user.username,
                }
                socket.broadcast.to(roomName).emit(ServerEvent.SEND_JOIN_CHATROOM, userJoiningChatroomMessage);
                this.logger.log(`'${userJoiningChatroomMessage.username}' is joining '${roomName}'`, ServerEvent.SEND_JOIN_CHATROOM);
            } else {
                socket.emit(ServerEvent.RESPONSE_JOIN_CHATROOM_NOT_EXISTING);
                this.logger.log(`Join chatroom "${chatroomMessage.room}" not accepted, because not existing.`, ServerEvent.RESPONSE_JOIN_CHATROOM_NOT_EXISTING);
            }
        });
    }


    private registerClientRequestsLeaveChatroom(socket: Socket): void {
        socket.on(ClientEvent.REQUEST_LEAVE_CHATROOM, (chatroomMessage: ChatroomMessage) => {
            if (!this.clientManager.authUser(socket)) return;
            const roomName: ChatroomName = chatroomMessage.room.trim();
            if (this.clientManager.isClientInChatroom(socket, roomName)) {
                this.unregisterClientFromRoom(socket);
                socket.leave(roomName);
                this.clientManager.removeClientFromChatroom(socket, roomName);
                socket.emit(ServerEvent.RESPONSE_LEAVE_CHATROOM_ACCEPT);
                this.logger.log(`Leave chatroom "${chatroomMessage.room}" accept.`, ServerEvent.RESPONSE_LEAVE_CHATROOM_ACCEPT);
                const userLeavingChatroomMessage: UsernameMessage = {
                    event: ServerEvent.SEND_LEAVE_CHATROOM,
                    type: MessageType.USERNAME,
                    date: new Date().toString(),
                    username: this.clientManager.getClientBySocket(socket).user.username,
                };
                socket.broadcast.to(roomName).emit(ServerEvent.SEND_LEAVE_CHATROOM, userLeavingChatroomMessage);
                this.logger.log(`'${userLeavingChatroomMessage.username}' is leaving '${roomName}'`, ServerEvent.SEND_LEAVE_CHATROOM);
            } else {
                socket.emit(ServerEvent.RESPONSE_LEAVE_CHATROOM_NOT_JOINED);
                this.logger.log(`Leave chatroom "${chatroomMessage.room}" not accept, because not joined!`, ServerEvent.RESPONSE_LEAVE_CHATROOM_NOT_JOINED)
            }
        });
    }


    private sendMessageListToClient(socket: Socket, roomName: ChatroomName, limit?: number): void {
        let messages: Message[];
        const existingMessage: Message[] = this.clientManager.getMessagesOfChatroom(roomName);
        if (limit != null) {
            messages = existingMessage.slice(Math.max(0, existingMessage.length - limit), existingMessage.length);
        } else {
            messages = existingMessage;
        }
        const allTextMessages: TextMessage[] = messages.filter(msg => msg.type === MessageType.TEXT) as TextMessage[];
        const loginMessageOfClient: UsernameMessage = {
            event: ServerEvent.SEND_JOIN_CHATROOM,
            type: MessageType.USERNAME,
            date: new Date().toString(),
            username: this.clientManager.getClientBySocket(socket).user.username,
        }
        const messageListMessage: MessageListMessage = {
            event: ServerEvent.RESPONSE_MESSAGE_LIST,
            type: MessageType.MESSAGE_LIST,
            date: new Date().toString(),
            messages: [
                ...allTextMessages,
                loginMessageOfClient
            ],
        }
        this.logger.log(`MessageList(${messageListMessage.messages.length})`, ServerEvent.RESPONSE_MESSAGE_LIST);
        socket.emit(ServerEvent.RESPONSE_MESSAGE_LIST, messageListMessage);
    }


    private sendOnlineUsersToClient(socket: Socket, roomName: ChatroomName): void {
        const onlineUsersMessage: UsernameListMessage = {
            event: ServerEvent.RESPONSE_ONLINE_USERS,
            type: MessageType.USERNAME_LIST,
            date: new Date().toString(),
            users: this.clientManager.getClientsOfChatroom(roomName)
                .map(c => c.user.username)
                .filter(name => name !== ""),
        };
        this.logger.log(`Online users (${onlineUsersMessage.users.length})`, ServerEvent.RESPONSE_ONLINE_USERS);
        socket.emit(ServerEvent.RESPONSE_ONLINE_USERS, onlineUsersMessage);
    }
}
