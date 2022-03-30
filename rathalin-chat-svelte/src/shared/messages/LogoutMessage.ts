import type { User } from "../user/User";
import type { Message } from "./Message";

export interface LogoutMessage extends Message {
    user: User;
}
