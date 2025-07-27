import type { Message } from "../Message";
import type { Username } from "./Username";

export interface UsernameMessage extends Message {
  username: Username;
}
