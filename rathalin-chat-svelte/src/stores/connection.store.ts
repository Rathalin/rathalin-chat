import { type Readable, readable } from "svelte/store";

export const socketIoServerConnection: Readable<string> = readable<string>("http://localhost:5001");
