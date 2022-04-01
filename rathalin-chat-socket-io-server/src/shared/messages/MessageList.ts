import { Message } from "./Message";

export interface MessageList extends Message {
    messages: Message[];
}
