import type { Message } from "src/shared/message/Message";
import type { ChatroomName } from "src/shared/message/room/ChatroomName";

export interface Chatroom {
  name: ChatroomName;
  messages: Message[];
}
