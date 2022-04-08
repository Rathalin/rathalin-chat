import type { Chatroom } from "src/shared/message/Chatroom";
import type { Client } from "./Client";

export interface ClientInChatroom {
    client: Client;
    chatroom: Chatroom;
}
