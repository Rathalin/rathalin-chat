import type { Message } from "./Message";

export interface UsernameTakenMessage extends Message {
    username: string;
}
