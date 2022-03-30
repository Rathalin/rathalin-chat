import type { User } from "../user/User";
import type { Message } from "./Message";

export interface LoginMessage extends Message {
    user: User;
}
