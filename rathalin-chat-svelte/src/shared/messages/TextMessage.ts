import type { Message } from "./Message";
import type { Username } from "./Username";

export interface TextMessage extends Message {
    text: string,
    sender: Username,
}
