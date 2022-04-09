import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface TextMessage extends Message {
    text: string,
    sender: Chatroom,
}
