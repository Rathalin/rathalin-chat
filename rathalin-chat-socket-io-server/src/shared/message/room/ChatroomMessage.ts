import type { Message } from "../Message";
import type { ChatroomName } from "./ChatroomName";

export interface ChatroomMessage extends Message {
    room: ChatroomName;
}
