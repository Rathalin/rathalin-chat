import type { Message } from "./Message";
import type { Username } from "./Username";

export interface UsernameTakenMessage extends Message {
    username: Username;
}
