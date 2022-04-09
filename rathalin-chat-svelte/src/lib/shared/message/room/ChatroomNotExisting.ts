import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface ChatroomNotExisting extends Message {
    name: Chatroom;
}
