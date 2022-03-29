import { User } from "$shared/user/User";
import { Message } from "./Message";

export interface TextMessage extends Message {
    text: string,
    sender: User,
}
