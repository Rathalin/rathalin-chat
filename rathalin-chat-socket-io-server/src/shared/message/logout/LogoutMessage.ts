import type { Message } from "../Message";
import type { Username } from "../Username";

export interface LogoutMessage extends Message {
    username: Username;
}
