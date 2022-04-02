import type { MessageType } from "../MessageType";
import type { SocketEvent } from "../SocketEvent";

export interface Message {
    event: SocketEvent;
    type: MessageType;
    date: Date;
}
