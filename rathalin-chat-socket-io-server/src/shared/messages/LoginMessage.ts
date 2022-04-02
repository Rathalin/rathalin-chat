import type { Message } from "./Message";
import type { Username } from "./Username";

export interface LoginMessage extends Message {
    username: Username;
}
