import { type Writable, writable, type Readable, derived } from "svelte/store";
import type { User } from "./User";
import { browser } from "$app/env";

// Connection
export const connected: Writable<boolean> = writable<boolean>(false);
export const loggedIn: Writable<boolean> = writable<boolean>(false);
connected.subscribe((newConnected) => {
    if (!newConnected) {
        loggedIn.set(false);
    }
});

// Username
export const user: Writable<User | null> = writable<User | null>(null);
const lastUsernameKey: string = "lastUsername";
export const lastUsername: Writable<string> = writable<string>(browser && localStorage != null ? localStorage.getItem(lastUsernameKey) ?? "" : "");
if (browser && localStorage != null) {
    lastUsername.subscribe((newUsername) => {
        localStorage.setItem(lastUsernameKey, newUsername);
        console.log(`LocalStorage: SetItem '${lastUsernameKey}' to '${newUsername}'`);
    });
}
user.subscribe((newUser) => {
    if (newUser != null && newUser.name.trim().length > 0) {
        lastUsername.set(newUser.name);
    }
});

// Chatroom
export const chatroom: Writable<string | null> = writable<string | null>(null);
loggedIn.subscribe((newLoggedIn) => {
    if (!newLoggedIn) {
        chatroom.set(null);
    }
});
const lastChatroomKey: string = "lastChatroom";
export const lastChatroom: Writable<string> = writable<string>(browser && localStorage != null ? localStorage.getItem(lastChatroomKey) ?? "" : "");
if (browser && localStorage != null) {
    lastChatroom.subscribe((newChatroomName) => {
        localStorage.setItem(lastChatroomKey, newChatroomName);
        console.log(`LocalStorage: SetItem '${lastChatroomKey}' to '${newChatroomName}'`);
    });
}
chatroom.subscribe((newChatroom) => {
    if (newChatroom != null && newChatroom.trim().length > 0) {
        lastChatroom.set(newChatroom);
    }
});
export const inChatroom: Readable<boolean> = derived<Writable<string | null>, boolean>(chatroom, $chatroom => $chatroom != null);

// List of online users
export const onlineUserNames: Writable<string[]> = writable<string[]>([]);
