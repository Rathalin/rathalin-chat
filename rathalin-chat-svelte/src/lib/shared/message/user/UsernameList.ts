import type { Message } from "../Message";
import type { Username } from "./Username";

export interface UsernameList extends Message {
    users: Username[];
}
