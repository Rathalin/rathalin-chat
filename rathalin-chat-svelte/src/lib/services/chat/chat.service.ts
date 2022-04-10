import { Manager, Socket } from "socket.io-client";
import { Subject } from "rxjs";
import type { LoginMessage } from "$lib/shared/message/login/LoginMessage";
import type { UsernameAcceptMessage } from "$lib/shared/message/login/UsernameAcceptMessage";
import type { UsernameTakenMessage } from "$lib/shared/message/login/UsernameTakenMessage";
import type { OnlineUserList } from "$lib/shared/message/online-user-list/OnlineUserList";
import type { LogoutMessage } from "$lib/shared/message/logout/LogoutMessage";
import type { TextMessage } from "$lib/shared/message/content/TextMessage";
import type { SystemInfoMessage } from "$lib/shared/message/system/SystemInfoMessage";
import type { SystemWarningMessage } from "$lib/shared/message/system/SystemWarningMessage";
import type { SystemErrorMessage } from "$lib/shared/message/system/SystemErrorMessage";
import { socketIoServerConnection } from "$lib/stores/config.store";
import { get } from "svelte/store";
import { SocketEvent } from "$lib/shared/SocketEvent";
import type { Chatroom } from "$lib/shared/message/Chatroom";
import type { ChatroomMessage } from "$lib/shared/message/room/ChatroomMessage";
import { MessageType } from "$lib/shared/MessageType";
import type { MessageListLimit } from "$lib/shared/message/message-list/MessageListLimit";
import type { Message } from "$lib/shared/message/Message";

class ChatService {

    public readonly onConnect: Subject<void> = new Subject();
    public readonly onReconnect: Subject<void> = new Subject();
    public readonly onDisconnect: Subject<void> = new Subject();
    public readonly onError: Subject<Error> = new Subject();
    public readonly onLogin: Subject<LoginMessage> = new Subject();
    public readonly onLoginUsernameAccept: Subject<UsernameAcceptMessage> = new Subject();
    public readonly onLoginUsernameTaken: Subject<UsernameTakenMessage> = new Subject();
    public readonly onOnlineUsers: Subject<OnlineUserList> = new Subject();
    public readonly onLogout: Subject<LogoutMessage> = new Subject();
    public readonly onTextMessage: Subject<TextMessage> = new Subject();
    public readonly onSystemInfo: Subject<SystemInfoMessage> = new Subject();
    public readonly onSystemWarning: Subject<SystemWarningMessage> = new Subject();
    public readonly onSystemError: Subject<SystemErrorMessage> = new Subject();

    /*
    CLIENT_REQUESTS_NEW_CHATROOM = "CLIENT_REQUESTS_NEW_CHATROOM",
    SERVER_RESPONDS_NEW_CHATROOM_ACCEPT = "SERVER_RESPONDS_NEW_CHATROOM_ACCEPT",
    SERVER_RESPONDS_CHATROOM_TAKEN = "SERVER_RESPONDS_CHATROOM_TAKEN",
    
    CLIENT_REQUESTS_JOIN_CHATROOM = "CLIENT_REQUESTS_JOIN_CHATROOM",
    SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT = "SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT",
    SERVER_RESPONDS_CHATROOM_NOT_EXISTING = "SERVER_RESPONDS_CHATROOM_NOT_EXISTING",
    */

    constructor() {
        const manager = new Manager(get(socketIoServerConnection), {
            autoConnect: false,
            reconnection: false,
        });
        this._socket = manager.socket("/");
        this.initConnections();
    }

    private _socket: Socket;
    private _room: string | null = null;


    private initConnections(): void {

        // Connect
        this._socket.on("connect", () => {
            this.onConnect.next();
        });

        // Connect Error
        this._socket.on("connect_error", (error: Error) => {
            this.onError.next(error);
        });

        // Reconnect
        this._socket.on("reconnect", () => {
            this.onReconnect.next();
        });

        // Reconnect Error
        this._socket.on("reconnect_error", (error: Error) => {
            this.onError.next(error);
        });

        // Disconnect
        this._socket.on("disconnect", () => {
            this.onDisconnect.next();
        });
        // Login
        this._socket.on(SocketEvent.SERVER_SENDS_LOGIN, (loginMessage: LoginMessage): void => {
            this.setDateFromDateString(loginMessage);
            this.onLogin.next(loginMessage);
        });

        // Username Accept
        this._socket.on(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT, (acceptMessage: UsernameAcceptMessage) => {
            this.setDateFromDateString(acceptMessage);
            this.onLoginUsernameAccept.next(acceptMessage);
        });

        // Username Taken
        this._socket.on(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_TAKEN, (takenMessage: UsernameTakenMessage) => {
            this.setDateFromDateString(takenMessage);
            this.onLoginUsernameTaken.next(takenMessage);
        });

        // Online Users
        this._socket.on(SocketEvent.SERVER_RESPONDS_ONLINE_USERS, (onlineUsers: OnlineUserList) => {
            this.setDateFromDateString(onlineUsers);
            this.onOnlineUsers.next(onlineUsers);
        });

        // Logout
        this._socket.on(SocketEvent.SERVER_SENDS_LOGOUT, (logoutMessage: LogoutMessage): void => {
            this.setDateFromDateString(logoutMessage);
            this.onLogout.next(logoutMessage);
        });

        // Text Message
        this._socket.on(SocketEvent.SERVER_SENDS_TEXT_MESSAGE, (textMessage: TextMessage): void => {
            this.setDateFromDateString(textMessage);
            this.onTextMessage.next(textMessage);
        });

        // System Info
        this._socket.on(SocketEvent.SERVER_SENDS_SYSTEM_INFO, (systemInfoMessage: SystemInfoMessage): void => {
            this.setDateFromDateString(systemInfoMessage);
            this.onSystemInfo.next(systemInfoMessage);
        });

        // System Warning
        this._socket.on(SocketEvent.SERVER_SENDS_SYSTEM_WARNING, (systemWarningMessage: SystemWarningMessage): void => {
            this.setDateFromDateString(systemWarningMessage);
            this.onSystemWarning.next(systemWarningMessage);
        });

        // System Error
        this._socket.on(SocketEvent.SERVER_SENDS_SYSTEM_ERROR, (systemErrorMessage: SystemErrorMessage): void => {
            this.setDateFromDateString(systemErrorMessage);
            this.onSystemError.next(systemErrorMessage);
        });
    }


    public connect(): void {
        this._socket.connect();
    }


    public disconnect(): void {
        this._socket.disconnect();
    }


    public login(loginMessage: LoginMessage): void {
        this._socket.emit(SocketEvent.CLIENT_REQUESTS_LOGIN, loginMessage);
    }


    public chatroomExists(room: Chatroom): Promise<boolean> {
        return new Promise((resolve) => {
            this._socket.on(SocketEvent.CLIENT_REQUESTS_CHATROOM_EXISTING, () => {
                resolve(true);
                this._socket.removeListener(SocketEvent.CLIENT_REQUESTS_CHATROOM_EXISTING);
            });
            this._socket.on(SocketEvent.SERVER_RESPONDS_CHATROOM_NOT_EXISTING, () => {
                resolve(false);
                this._socket.removeListener(SocketEvent.SERVER_RESPONDS_CHATROOM_NOT_EXISTING);
            });
            const chatroomMessage: ChatroomMessage = {
                event: SocketEvent.CLIENT_REQUESTS_CHATROOM_EXISTING,
                type: MessageType.CHATROOM,
                date: new Date(),
                room,
            };
            this._socket.emit(SocketEvent.CLIENT_REQUESTS_CHATROOM_EXISTING, chatroomMessage);
        });
    }


    public createChatroom(room: Chatroom): Promise<boolean> {
        return new Promise((resolve) => {
            this._socket.on(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_ACCEPT, () => {
                resolve(true);
                this._socket.removeListener(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_ACCEPT);
            });
            this._socket.on(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_TAKEN, () => {
                resolve(false);
                this._socket.removeListener(SocketEvent.SERVER_RESPONDS_CREATE_CHATROOM_TAKEN);
            });
            const chatroomMessage: ChatroomMessage = {
                event: SocketEvent.CLIENT_REQUESTS_CREATE_CHATROOM,
                type: MessageType.CHATROOM,
                date: new Date(),
                room,
            };
            this._socket.emit(SocketEvent.CLIENT_REQUESTS_CREATE_CHATROOM, chatroomMessage);
        });
    }


    public joinChatroom(room: Chatroom): Promise<boolean> {
        return new Promise((resolve) => {
            this._socket.on(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT, () => {
                resolve(true);
                this._socket.removeListener(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT);
            });
            this._socket.on(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_NOT_EXISTING, () => {
                resolve(false);
                this._socket.removeListener(SocketEvent.SERVER_RESPONDS_JOIN_CHATROOM_NOT_EXISTING);
            });
            const chatroomMessage: ChatroomMessage = {
                event: SocketEvent.CLIENT_REQUESTS_JOIN_CHATROOM,
                type: MessageType.CHATROOM,
                date: new Date(),
                room,
            };
            this._socket.emit(SocketEvent.CLIENT_REQUESTS_JOIN_CHATROOM, chatroomMessage);
        });
    }


    public requestMessageList(limit?: number): void {
        const messageListLimit: MessageListLimit = {
            event: SocketEvent.CLIENT_REQUESTS_MESSAGE_LIST,
            type: MessageType.MESSAGE_LIST_LIMIT,
            date: new Date(),
            limit,
        }
        this._socket.emit(SocketEvent.CLIENT_REQUESTS_MESSAGE_LIST, messageListLimit);
    }


    public requestOnlineUsers(): void {
        this._socket.emit(SocketEvent.CLIENT_REQUESTS_ONLINE_USERS);
    }


    public sendTextMessage(textmessage: TextMessage): void {
        this._socket.emit(SocketEvent.CLIENT_SENDS_TEXT_MESSAGE, textmessage);
    }


    private setDateFromDateString(data: any): void {
        data.date = new Date(data.date);
    }


    public isLoginMessage(message: Message): message is LoginMessage {
        return message.type === MessageType.LOGIN;
    }


    public isLogoutMessage(message: Message): message is LogoutMessage {
        return message.type === MessageType.LOGOUT;
    }


    public isSystemErrorMessage(message: Message): message is SystemErrorMessage {
        return message.type === MessageType.SYSTEM_ERROR;
    }


    public isSystemInfoMessage(message: Message): message is SystemInfoMessage {
        return message.type === MessageType.SYSTEM_INFO;
    }


    public isSystemWarningMessage(message: Message): message is SystemWarningMessage {
        return message.type === MessageType.SYSTEM_WARNING;
    }


    public isTextMessage(message: Message): message is TextMessage {
        return message.type === MessageType.TEXT;
    }


    // Private Methods
}


export const chatService: ChatService = new ChatService();
