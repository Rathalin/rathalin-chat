import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface NewChatroom extends Message {
    name: Chatroom;
}
