import type { Socket } from "socket.io";
import type { Client } from "../interface/Client";
import type { ClientInChatroom } from "../interface/ClientInChatroom";
import type { User } from "../interface/User";
import type { Username } from "../../shared/message/user/Username";
import type { Chatroom } from "src/shared/message/room/Chatroom";

export class ClientManager {

    // Constructor

    // Members and Properties

    private _clients: Client[] = [];
    public get clients(): Client[] {
        return [...this._clients];
    }

    private _chatrooms: Chatroom[] = [];
    public get chatrooms(): Chatroom[] {
        return [...this._chatrooms];
    }

    private _clientsInChatrooms: ClientInChatroom[] = [];
    public get clientsInChatrooms(): ClientInChatroom[] {
        return [...this._clientsInChatrooms];
    }


    // Public Methods


    public getClient(socket: Socket): Client {
        const client: Client | undefined = this._clients.find(c => c.socket === socket);
        if (client == null) {
            throw new Error(`Socket not found in client list!`);
        }
        return client;
    }


    public addClient(socket: Socket): Client {
        const client: Client = {
            socket,
            user: { username: "" },
        };
        this._clients.push(client);
        return client;
    }


    public addUserToClient(socket: Socket, user: User): void {
        const client: Client = this.getClient(socket);
        client.user = user;
    }


    public setUsernameOfClient(socket: Socket, username: string) {
        const user: User = this.getClient(socket).user;
        user.username = username;
    }


    public removeClient(socket: Socket): Client {
        const client: Client = this.getClient(socket);
        this.removeClientFromChatrooms(socket);
        this._clients = this._clients.filter(c => c.socket !== socket);
        return client;
    }


    public usernameTaken(username: Username): boolean {
        return this._clients
            .some(client => client.user.username.toLowerCase() === username.toLowerCase());
    }


    public hasValidUsername(socket: Socket): boolean {
        return this.getClient(socket).user.username.length > 0;
    }


    public chatroomExists(chatroom: Chatroom): boolean {
        return this._chatrooms.some(room => room.toLowerCase() === chatroom.toLowerCase());
    }


    public addChatroom(room: Chatroom): void {
        if (this.chatroomExists(room)) {
            throw new Error(`Chatroom '${room}' can not be added because it already exists.`);
        }
        this._chatrooms.push(room);
    }


    public addClientToChatroom(socket: Socket, room: Chatroom): void {
        if (!this.chatroomExists(room)) {
            throw new Error(`Chatroom ${room} does not exist.`);
        }
        this._clientsInChatrooms.push({
            client: this.getClient(socket),
            chatroom: room,
        });
    }


    public isClientInChatroom(socket: Socket, room: Chatroom): boolean {
        const client: Client = this.getClient(socket);
        return this._clientsInChatrooms
            .some(clientInRoom => clientInRoom.client === client && clientInRoom.chatroom === room);
    }


    public getChatroomsOfClient(socket: Socket): Chatroom[] {
        return this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.client.socket === socket)
            .map(clientInRoom => clientInRoom.chatroom);
    }


    public getClientsOfChatroom(room: Chatroom): Client[] {
        return this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.chatroom === room)
            .map(clientInRoom => clientInRoom.client);
    }


    public removeClientFromChatroom(socket: Socket, room: Chatroom): void {
        const client: Client = this.getClient(socket);
        this._clientsInChatrooms = this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.client !== client || clientInRoom.chatroom !== room);
    }


    private removeClientFromChatrooms(socket: Socket): void {
        const client: Client = this.getClient(socket);
        this._clientsInChatrooms = this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.client !== client);
    }


    private removeChatroomFromClients(room: Chatroom): void {
        this._clientsInChatrooms = this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.chatroom !== room);
    }


    public removeChatroom(room: Chatroom): void {
        this.removeChatroomFromClients(room);
        this._chatrooms = this._chatrooms.filter(chatroom => chatroom !== room);
    }

    public authUser(socket: Socket): boolean {
        return this.hasValidUsername(socket);
    }

    // Private Methods

}