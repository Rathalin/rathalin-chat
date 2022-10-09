import { writable, readable } from "svelte/store";

// Message List Limit
export const messageListLimit = readable(100);

// Transitions
export const messageFadeInPosition = readable(-10);
export const messageFadeInDuration = readable(300);

// Connection
export const socketIoServerConnection = readable(`http://${import.meta.env.VITE_CHAT_SERVER_HOST ?? "localhost"}:5001`);

