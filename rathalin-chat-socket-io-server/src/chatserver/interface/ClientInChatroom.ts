import type { Chatroom } from "src/shared/message/room/Chatroomtroom";
import type { Client } from "./Client";

export interface ClientInChatroom {
    client: Client;
    chatroom: Chatroom;
}
