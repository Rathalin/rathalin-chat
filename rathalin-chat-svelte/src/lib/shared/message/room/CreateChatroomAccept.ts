import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface CreateChatroomAccept extends Message {
    name: Chatroom;
}
