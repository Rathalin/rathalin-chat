import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface JoinChatroomAccept extends Message {
    name: Chatroom;
}
