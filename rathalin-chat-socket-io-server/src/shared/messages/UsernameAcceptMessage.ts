import type { Message } from "./Message";
import type { Username } from "./Username";

export interface UsernameAcceptMessage extends Message {
    username: Username;
}
