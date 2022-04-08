import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface NewChatroomAccept extends Message {
    name: Chatroom;
}
