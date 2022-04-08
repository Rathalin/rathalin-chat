import type { Username } from "../shared/message/Username";
import { type Writable, writable, type Readable, readable, type Subscriber, type Unsubscriber } from "svelte/store";
import type { Chatroom } from "../shared/message/Chatroom";
import type { User } from "./User";

// User
export const user: Writable<User | null> = writable<User | null>(null);
export const lastUsername: Writable<Username> = writable<Username>("", function start(set: Subscriber<Username>) {
    const unsubscribe: Unsubscriber = user.subscribe((u: User | null) => set(u?.name ?? ""));
    return function stop() {
        unsubscribe();
    }
});
export const connected: Writable<boolean> = writable<boolean>(false);
export const loggedIn: Writable<boolean> = writable<boolean>(false);

// Chatroom
export const chatroom: Writable<Chatroom | null> = writable<Chatroom | null>(null);
export const inChatroom: Readable<boolean> = readable(false, function start(set: Subscriber<boolean>) {
    const unsubscribe: Unsubscriber = chatroom.subscribe((value: Chatroom | null) => {
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
export const onlineUserNames: Writable<Username[]> = writable<Username[]>([]);
