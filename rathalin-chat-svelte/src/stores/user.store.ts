import { type Writable, writable } from "svelte/store";

function createUserStore() {
    const { subscribe, set } = writable(null);
    
    return {
        subscribe,
        set,
        reset: (): void => set(null),
    }
};

export const user = createUserStore();
export const loggedIn: Writable<boolean> = writable<boolean>(false);
export const lastUsername: Writable<string> = writable('');
