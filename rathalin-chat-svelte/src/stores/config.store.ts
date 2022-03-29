import { type Writable, writable } from "svelte/store";

export const selectedLocale: Writable<string> = writable<string>('en');
