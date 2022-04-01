import { SocketEvent } from "$shared/events/SocketEvent";

export interface Message {
    type: SocketEvent;
    date: Date;
}
