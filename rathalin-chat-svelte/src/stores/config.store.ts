import { type Writable, writable, type Readable, readable } from "svelte/store";

export const selectedLocale: Writable<string> = writable<string>('en');
export const socketIoServerConnection: Readable<string> = readable<string>("http://192.168.42.231:5001");
