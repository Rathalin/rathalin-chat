import type { Chatroom } from "src/shared/message/room/Chatroom";
import type { Client } from "./Client";

export interface ClientInChatroom {
    client: Client;
    chatroom: Chatroom;
}
