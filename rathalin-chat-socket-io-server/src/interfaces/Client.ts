import type { Socket } from "socket.io";
import type { User } from "./User";

export interface Client {
    socket: Socket;
    user: User;
}
