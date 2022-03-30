import { type Writable, writable, type Readable, readable } from "svelte/store";

export const selectedLocale: Writable<string> = writable<string>('en');
export const socketIoServerConnection: Readable<string> = readable<string>("http://193.170.135.99:5001");
