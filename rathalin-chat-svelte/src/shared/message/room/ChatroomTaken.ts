import type { Chatroom } from "../Chatroom";
import type { Message } from "../Message";

export interface ChatroomTaken extends Message {
    name: Chatroom;
}
