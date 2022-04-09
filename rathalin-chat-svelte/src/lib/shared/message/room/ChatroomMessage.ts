import type { Message } from "../Message";

export interface ChatroomMessage extends Message {
    room: string;
}
