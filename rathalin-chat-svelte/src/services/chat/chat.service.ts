import { Manager, Socket } from "socket.io-client";
import { Subject } from "rxjs";
import { get } from "svelte/store";
import type { TextMessage } from "../../shared/messages/TextMessage";
import type { SystemInfoMessage } from "../../shared/messages/SystemInfoMessage";
import type { SystemWarningMessage } from "../../shared/messages/SystemWarningMessage";
import type { SystemErrorMessage } from "../../shared/messages/SystemErrorMessage";
import { SocketEventEnum } from "../../shared/events/SocketEventEnum";
import type { LoginMessage } from "../../shared/messages/LoginMessage";
import type { LogoutMessage } from "../../shared/messages/LogoutMessage";
import { socketIoServerConnection } from "../../stores/config.store";

class ChatService {

    private _socket: Socket;

    public readonly onConnected: Subject<void> = new Subject();
    public readonly onDisconnected: Subject<void> = new Subject();
    public readonly onError: Subject<Error> = new Subject();
    public readonly onLogin: Subject<LoginMessage> = new Subject();
    public readonly onLogout: Subject<LogoutMessage> = new Subject();
    public readonly onTextMessage: Subject<TextMessage> = new Subject();
    public readonly onSystemInfoMessage: Subject<SystemInfoMessage> = new Subject();
    public readonly onSystemWarningMessage: Subject<SystemWarningMessage> = new Subject();
    public readonly onSystemErrorMessage: Subject<SystemErrorMessage> = new Subject();


    constructor() {
        const manager = new Manager(get(socketIoServerConnection), {
            autoConnect: false,
        });
        this._socket = manager.socket("/");
        this.initConnections();
    }


    private initConnections(): void {
        this._socket.on("connect", () => this.onConnected.next());
        this._socket.on("disconnect", () => this.onDisconnected.next());
        this._socket.on("connect_error", (error) => this.onError.next(error));
        this._socket.on(SocketEventEnum.LOGIN, (data: any): void => {
            this.onLogin.next({
                user: data.user,
                date: new Date(data.date),
            });
        });
        this._socket.on(SocketEventEnum.LOGOUT, (data: any): void => {
            this.onLogout.next({
                user: data.user,
                date: new Date(data.date),
            });
        });
        this._socket.on(SocketEventEnum.TEXT_MESSAGE, (data: any): void => {
            this.onTextMessage.next({
                sender: data.sender,
                text: data.text,
                date: new Date(data.date),
            });
        });
        this._socket.on(SocketEventEnum.SYSTEM_INFO, (data: any): void => {
            this.onSystemInfoMessage.next({
                text: data.text,
                date: new Date(data.date),
            });
        });
        this._socket.on(SocketEventEnum.SYSTEM_WARNING, (data: any): void => {
            this.onSystemInfoMessage.next({
                text: data.text,
                date: new Date(data.date),
            });
        });
        this._socket.on(SocketEventEnum.SYSTEM_ERROR, (data: any): void => {
            this.onSystemInfoMessage.next({
                text: data.text,
                date: new Date(data.date),
            });
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
