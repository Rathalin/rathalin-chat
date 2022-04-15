import type { Message } from "../Message";
import type { ChatroomName } from "../room/ChatroomName";

export interface TextMessage extends Message {
    text: string;
    sender: ChatroomName;
}
