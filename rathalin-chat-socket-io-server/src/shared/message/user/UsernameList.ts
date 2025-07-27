import type { Message } from "../Message";
import type { Username } from "./Username";

export interface UsernameListMessage extends Message {
  users: Username[];
}
