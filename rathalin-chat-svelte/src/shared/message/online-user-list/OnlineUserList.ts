import type { Message } from "../Message";
import type { Username } from "../Username";

export interface OnlineUserList extends Message {
    users: Username[];
}
