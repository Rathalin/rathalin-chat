import type { User } from "../user/User";
import type { Message } from "./Message";

export interface TextMessage extends Message {
    text: string,
    sender: User,
}
