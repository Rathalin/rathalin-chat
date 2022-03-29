import { User } from "$shared/user/User";
import { Message } from "./Message";

export interface LoginMessage extends Message {
    user: User;
}
