import { SocketEventEnum } from "$shared/events/SocketEventEnum";

export interface Message {
    type: SocketEventEnum;
    date: Date;
}
