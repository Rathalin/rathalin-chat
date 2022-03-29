import { User } from "$shared/user/User";
import { Message } from "./Message";

export interface LogoutMessage extends Message {
    user: User;
}
