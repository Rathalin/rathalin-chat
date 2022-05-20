import type { Theme } from "$lib/types/Theme";
import { readable, writable, type Readable, type Writable } from "svelte/store";

export const theme: Writable<Theme> = writable<Theme>("light");
export const iconSize: Readable<string> = readable<string>("1.3em");
