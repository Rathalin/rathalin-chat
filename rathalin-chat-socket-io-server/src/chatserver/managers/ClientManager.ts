import type { Socket } from "socket.io";
import type { Client } from "../interface/Client";
import type { User } from "../interface/User";
import type { Username } from "../../shared/message/user/Username";
import type { ChatroomName } from "src/shared/message/room/ChatroomName";
import type { Message } from "src/shared/message/Message";
import type { Chatroom } from "../interface/Chatroom";
import type { ClientInChatroom } from "../interface/ClientInChatroom";

export class ClientManager {

    // Constructor

    // Members and Properties

    private _clients: Client[] = [];
    public get numberOfClients(): number {
        return this._clients.length;
    }

    private _chatrooms: Chatroom[] = [];
    private _clientsInChatrooms: ClientInChatroom[] = [];


    // Public Methods

    public getClientBySocket(socket: Socket): Client {
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
        const client: Client = this.getClientBySocket(socket);
        client.user = user;
    }


    public setUsernameOfClient(socket: Socket, username: string) {
        const user: User = this.getClientBySocket(socket).user;
        user.username = username;
    }


    public removeClient(socket: Socket): Client {
        const client: Client = this.getClientBySocket(socket);
        this.removeClientFromChatrooms(socket);
        this._clients = this._clients.filter(c => c.socket !== socket);
        return client;
    }


    public usernameTaken(username: Username): boolean {
        return this._clients
            .some(client => client.user.username.toLowerCase() === username.toLowerCase());
    }


    public hasValidUsername(socket: Socket): boolean {
        return this.getClientBySocket(socket).user.username.length > 0;
    }


    public chatroomExists(name: ChatroomName): boolean {
        return this._chatrooms.some(c => c.name.toLowerCase() === name.toLowerCase());
    }


    public addChatroom(name: ChatroomName): void {
        if (this.chatroomExists(name)) {
            throw new Error(`Chatroom '${name}' can not be added because it already exists.`);
        }
        this._chatrooms.push({
            name,
            messages: [],
        });
    }


    public addClientToChatroom(socket: Socket, roomName: ChatroomName): void {
        if (!this.chatroomExists(roomName)) {
            throw new Error(`Chatroom ${roomName} does not exist.`);
        }
        this._clientsInChatrooms.push({
            client: this.getClientBySocket(socket),
            roomName: roomName,
        });
    }


    public addMessageToChatroom(roomName: ChatroomName, ...messages: Message[]): void {
        const room: Chatroom = this.getChatroomByName(roomName);
        room.messages.push(...messages);
    }


    public getMessagesOfChatroom(roomName: ChatroomName): Message[] {
        return [...this.getChatroomByName(roomName).messages];
    }


    public isClientInChatroom(socket: Socket, roomName: ChatroomName): boolean {
        const client: Client = this.getClientBySocket(socket);
        return this._clientsInChatrooms
            .some(clientInRoom => clientInRoom.client === client && clientInRoom.roomName === roomName);
    }


    public getChatroomNamesOfClient(socket: Socket): ChatroomName[] {
        return this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.client.socket === socket)
            .map(clientInRoom => clientInRoom.roomName);
    }


    public getClientsOfChatroom(roomName: ChatroomName): Client[] {
        return this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.roomName === roomName)
            .map(clientInRoom => clientInRoom.client);
    }


    public removeClientFromChatroom(socket: Socket, roomName: ChatroomName): void {
        const client: Client = this.getClientBySocket(socket);
        this._clientsInChatrooms = this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.client !== client || clientInRoom.roomName !== roomName);
    }


    // Private Methods


    private getChatroomByName(name: ChatroomName): Chatroom {
        const foundChatroom: Chatroom | undefined = this._chatrooms.find(c => c.name === name);
        if (foundChatroom == null) {
            throw new Error(`No chatroom found with name '${name}'`);
        }
        return foundChatroom;
    }

    private removeClientFromChatrooms(socket: Socket): void {
        const client: Client = this.getClientBySocket(socket);
        this._clientsInChatrooms = this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.client !== client);
    }


    private removeChatroomFromClients(roomName: ChatroomName): void {
        this._clientsInChatrooms = this._clientsInChatrooms
            .filter(clientInRoom => clientInRoom.roomName !== roomName);
    }


    public removeChatroom(roomName: ChatroomName): void {
        this.removeChatroomFromClients(roomName);
        this._chatrooms = this._chatrooms.filter(chatroom => chatroom.name !== roomName);
    }

    public authUser(socket: Socket): boolean {
        return this.hasValidUsername(socket);
    }

    // Private Methods

}