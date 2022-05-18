import { loggedIn, connected, inChatroom } from "$lib/stores/user.store"
import { get } from "svelte/store";

export function isAuthorized(): boolean {
    return get(loggedIn) && get(connected) && get(inChatroom);
}
