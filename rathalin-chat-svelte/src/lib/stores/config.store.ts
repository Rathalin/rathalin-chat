import { type Writable, writable, type Readable, readable } from "svelte/store";

// Message List Limit
export const messageListLimit: Readable<number> = readable<number>(100);

// Transitions
export const messageFadeInPosition: Readable<number> = readable<number>(-10);
export const messageFadeInDuration: Readable<number> = readable<number>(300);

// Connection
export const socketIoServerConnection: Readable<string> = readable<string>("http://localhost:5001");
// export const socketIoServerConnection: Readable<string> = readable<string>("http://192.168.0.108:5001");
