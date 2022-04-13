import { type Writable, writable, type Readable, readable, type Subscriber, type Unsubscriber } from "svelte/store";
import type { User } from "./User";

// User
export const user: Writable<User | null> = writable<User | null>(null);
export const lastUsername: Writable<string> = writable<string>("", function start(set: Subscriber<string>) {
    const unsubscribe: Unsubscriber = user.subscribe((u: User | null) => set(u?.name ?? ""));
    return function stop() {
        unsubscribe();
    }
});
export const connected: Writable<boolean> = writable<boolean>(false);
export const loggedIn: Writable<boolean> = writable<boolean>(false);
connected.subscribe((value) => {
    if (!value) {
        loggedIn.set(false);
    }
});

// Chatroom
export const chatroom: Writable<string | null> = writable<string | null>(null);
loggedIn.subscribe((value) => {
    if (!value) {
        chatroom.set(null);
    }
});
export const inChatroom: Readable<boolean> = readable(false, function start(set: Subscriber<boolean>) {
    const unsubscribe: Unsubscriber = chatroom.subscribe((value: string | null) => {
        if (value != null) {
            set(true);
        } else {
            set(false);
        }
    });
    return function stop() {
        unsubscribe();
    }
});

// List of online users
export const onlineUserNames: Writable<string[]> = writable<string[]>([]);
