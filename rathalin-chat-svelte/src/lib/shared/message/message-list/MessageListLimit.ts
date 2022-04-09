import type { Message } from "../Message";

export interface MessageListLimit extends Message {
    limit?: number;
}
