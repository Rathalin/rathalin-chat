import { Manager, Socket } from "socket.io-client";
import { Subject } from "rxjs";
import { get } from "svelte/store";
import { SocketEventEnum } from "../../shared/events/SocketEventEnum";
import { socketIoServerConnection } from "../../stores/config.store";
import type { TextMessage } from "../../shared/messages/TextMessage";
import type { SystemInfoMessage } from "../../shared/messages/SystemInfoMessage";
import type { SystemWarningMessage } from "../../shared/messages/SystemWarningMessage";
import type { SystemErrorMessage } from "../../shared/messages/SystemErrorMessage";
import type { LoginMessage } from "../../shared/messages/LoginMessage";
import type { LogoutMessage } from "../../shared/messages/LogoutMessage";
import type { UsernameAcceptMessage } from "src/shared/messages/UsernameAcceptMessage";
import type { UsernameTakenMessage } from "src/shared/messages/UsernameTakenMessage";

class ChatService {

    private _socket: Socket;

    public readonly onConnected: Subject<void> = new Subject();
    public readonly onDisconnected: Subject<void> = new Subject();
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
        this._socket.on("connect", () => this.onConnected.next());

        // Disconnect
        this._socket.on("disconnect", () => this.onDisconnected.next());

        // Connect Error
        this._socket.on("connect_error", (error) => this.onError.next(error));
        this._socket.on(SocketEventEnum.LOGIN, (data: any): void => {
            this.onLogin.next({
                type: SocketEventEnum.LOGIN,
                user: data.user,
                date: new Date(data.date),
            });
        });

        // Logout
        this._socket.on(SocketEventEnum.LOGOUT, (data: any): void => {
            const logoutMessage: LogoutMessage = data;
            logoutMessage.date = new Date(data.date);
            this.onLogout.next(logoutMessage);
        });

        // Text Message
        this._socket.on(SocketEventEnum.TEXT_MESSAGE, (data: any): void => {
            const textMessage: TextMessage = data;
            textMessage.date = new Date(data.date);
            this.onTextMessage.next(textMessage);
        });

        // System Info
        this._socket.on(SocketEventEnum.SYSTEM_INFO, (data: any): void => {
            const systemInfoMessage: SystemInfoMessage = data;
            systemInfoMessage.date = new Date(data.date);
            this.onSystemInfo.next(systemInfoMessage);
        });

        // System Warning
        this._socket.on(SocketEventEnum.SYSTEM_WARNING, (data: any): void => {
            const systemWarningMessage: SystemWarningMessage = data;
            systemWarningMessage.date = new Date(data.date);
            this.onSystemInfo.next(systemWarningMessage);
        });

        // System Error
        this._socket.on(SocketEventEnum.SYSTEM_ERROR, (data: any): void => {
            const systemErrorMessage: SystemErrorMessage = data;
            systemErrorMessage.date = new Date(data.date);
            this.onSystemInfo.next(systemErrorMessage);
        });

    }


    public connect(): void {
        this._socket.connect();
    }


    public disconnect(): void {
        this._socket.disconnect();
    }


    public login(loginMessage: LoginMessage): void {
        this._socket.emit(SocketEventEnum.LOGIN, loginMessage);
    }


    public logout(logoutMessage: LogoutMessage): void {
        this._socket.emit(SocketEventEnum.LOGOUT, logoutMessage);
    }


    public sendTextMessage(textmessage: TextMessage): void {
        this._socket.emit(SocketEventEnum.TEXT_MESSAGE, textmessage);
    }

}


export const chatService: ChatService = new ChatService();
