import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface CreateChatroom extends Message {
    name: Chatroom;
}
