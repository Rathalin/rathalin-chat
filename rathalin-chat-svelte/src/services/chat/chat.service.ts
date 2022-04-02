import { Manager, Socket } from "socket.io-client";
import { Subject } from "rxjs";
import { get } from "svelte/store";
import { SocketEvent } from "../../shared/SocketEvent";
import { socketIoServerConnection } from "../../stores/config.store";
import type { TextMessage } from "../../shared/messages/TextMessage";
import type { SystemInfoMessage } from "../../shared/messages/SystemInfoMessage";
import type { SystemWarningMessage } from "../../shared/messages/SystemWarningMessage";
import type { SystemErrorMessage } from "../../shared/messages/SystemErrorMessage";
import type { LoginMessage } from "../../shared/messages/LoginMessage";
import type { LogoutMessage } from "../../shared/messages/LogoutMessage";
import type { UsernameAcceptMessage } from "../../shared/messages/UsernameAcceptMessage";
import type { UsernameTakenMessage } from "../../shared/messages/UsernameTakenMessage";
import { MessageType } from "../../shared/MessageType";
import type { Message } from "../../shared/messages/Message";

class ChatService {

    private _socket: Socket;

    public readonly onConnect: Subject<void> = new Subject();
    public readonly onDisconnect: Subject<void> = new Subject();
    public readonly onError: Subject<Error> = new Subject();
    public readonly onLogin: Subject<LoginMessage> = new Subject();
    public readonly onLoginUsernameAccept: Subject<UsernameAcceptMessage> = new Subject();
    public readonly onLoginUsernameTaken: Subject<UsernameTakenMessage> = new Subject();
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


    private initConnections(): void {

        // Connect
        this._socket.on("connect", () => {
            this.onConnect.next();
        });

        // Disconnect
        this._socket.on("disconnect", () => {
            this.onDisconnect.next();
        });

        // Connect Error
        this._socket.on("connect_error", (error) => {
            this.onError.next(error);
        });

        // Login
        this._socket.on(SocketEvent.SERVER_SENDS_LOGIN, (loginMessage: LoginMessage): void => {
            this.setDateFromDateString(loginMessage);
            this.onLogin.next(loginMessage);
        });

        // Username Accept
        this._socket.on(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT, (acceptMessage: UsernameAcceptMessage) => {
            this.setDateFromDateString(acceptMessage);
            console.log("LOGIN_USERNAME_ACCEPT");
            this.onLoginUsernameAccept.next(acceptMessage);
        });

        // Username Taken
        this._socket.on(SocketEvent.SERVER_RESPONDS_LOGIN_USERNAME_TAKEN, (takenMessage: UsernameTakenMessage) => {
            this.setDateFromDateString(takenMessage);
            console.log("LOGIN_USERNAME_TAKEN");
            this.onLoginUsernameTaken.next(takenMessage);
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
        this._socket.emit(SocketEvent.CLIENT_REQUESTS_MESSAGES, limit);
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
