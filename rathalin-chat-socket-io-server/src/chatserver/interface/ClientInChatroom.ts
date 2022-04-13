import type { ChatroomName } from "src/shared/message/room/ChatroomName";
import type { Client } from "./Client";

export interface ClientInChatroom {
    client: Client;
    roomName: ChatroomName;
}
