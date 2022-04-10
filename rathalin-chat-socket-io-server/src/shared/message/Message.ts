import type { ClientEvent } from "../ClientEvent";
import type { MessageType } from "../MessageType";
import type { ServerEvent } from "../ServerEvent";

export interface Message {
    event: ClientEvent | ServerEvent;
    type: MessageType;
    date: string;
}
