import type { Message } from "../Message";

export interface SystemMessage extends Message {
    text: string;
}
