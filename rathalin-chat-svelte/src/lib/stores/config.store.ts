import { writable, readable } from "svelte/store";

// Message List Limit
export const messageListLimit = readable(100);

// Transitions
export const messageFadeInPosition = readable(-10);
export const messageFadeInDuration = readable(300);

// Connection
let chatServerHost = "localhost";
chatServerHost = "192.168.0.248";
export const socketIoServerConnection = readable(`http://${chatServerHost}:5001`);
