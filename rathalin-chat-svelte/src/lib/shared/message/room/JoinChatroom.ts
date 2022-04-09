import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface JoinChatroom extends Message {
    name: Chatroom;
}
