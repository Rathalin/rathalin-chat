import { Manager, Socket } from "socket.io-client";
import { Subject } from "rxjs";
import { get } from "svelte/store";
import { SocketEvent } from "../../shared/SocketEvent";
import { socketIoServerConnection } from "../../stores/config.store";
import { MessageType } from "../../shared/MessageType";
import type { LoginMessage } from "../../shared/message/login/LoginMessage";
import type { UsernameAcceptMessage } from "../../shared/message/login/UsernameAcceptMessage";
import type { UsernameTakenMessage } from "../../shared/message/login/UsernameTakenMessage";
import type { OnlineUserList } from "../../shared/message/online-user-list/OnlineUserList";
import type { LogoutMessage } from "../../shared/message/logout/LogoutMessage";
import type { TextMessage } from "../../shared/message/content/TextMessage";
import type { SystemInfoMessage } from "../../shared/message/system/SystemInfoMessage";
import type { SystemWarningMessage } from "../../shared/message/system/SystemWarningMessage";
import type { SystemErrorMessage } from "../../shared/message/system/SystemErrorMessage";
import type { MessageListLimit } from "../../shared/message/message-list/MessageListLimit";
import type { Message } from "../../shared/message/Message";

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

    constructor() {
        const manager = new Manager(get(socketIoServerConnection), {
            autoConnect: false,
            reconnection: false,
        });
        this._socket = manager.socket("/");
        this.initConnections();
    }

    private _socket: Socket;


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
}


export const chatService: ChatService = new ChatService();
