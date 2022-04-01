import type { SocketEventEnum } from "../events/SocketEventEnum";

export interface Message {
    type: SocketEventEnum;
    date: Date;
}
