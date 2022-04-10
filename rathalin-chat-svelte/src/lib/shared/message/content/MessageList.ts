import type { Message } from "../Message";
import type { UsernameMessage } from "../user/UsernameMessage";
import type { TextMessage } from "./TextMessage";

export interface MessageList extends Message {
    messages: TextMessage | UsernameMessage;
} 
