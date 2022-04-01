import { Message } from "./Message";

export interface UsernameAcceptMessage extends Message {
    username: string;
}
