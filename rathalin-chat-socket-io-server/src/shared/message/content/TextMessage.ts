import type { Message } from "../Message";
import type { Chatroom } from "../room/Chatroom";

export interface TextMessage extends Message {
    text: string;
    sender: Chatroom;
}
