import { type Writable, writable, type Readable, readable } from "svelte/store";

export const selectedLocale: Writable<string> = writable<string>('en');
export const socketIoServerConnection: Readable<string> = readable<string>("http://localhost:5001");
