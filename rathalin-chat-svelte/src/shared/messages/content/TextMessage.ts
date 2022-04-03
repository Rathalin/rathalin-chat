import type { Username } from "../Username";
import type { Message } from "../Message";

export interface TextMessage extends Message {
    text: string,
    sender: Username,
}
