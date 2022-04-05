import type { Username } from "../shared/messages/Username";
import { type Writable, writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set } = writable(null);
    
    return {
        subscribe,
        set,
        reset: (): void => set(null),
    }
};

// User
export const user = createUserStore();
export const connected: Writable<boolean> = writable<boolean>(false);
export const loggedIn: Writable<boolean> = writable<boolean>(false);

// Last username
export const lastUsername: Writable<string> = writable<string>('');

// List of online users
export const onlineUserNames: Writable<Username[]> = writable<Username[]>([]);
