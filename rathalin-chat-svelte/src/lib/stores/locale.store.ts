import { browser } from "$app/env";
import { writable, type Writable } from "svelte/store";

export const defaultLocale: string = "en";
const languageKey: string = "language";
export const selectedLocale: Writable<string> = writable<string>(
  browser && localStorage != null
    ? (localStorage.getItem(languageKey) ?? defaultLocale)
    : defaultLocale,
);
if (browser && localStorage != null) {
  selectedLocale.subscribe((newLocale) => {
    localStorage.setItem(languageKey, newLocale);
    console.log(`LocalStorage: SetItem '${languageKey}' to '${newLocale}'`);
  });
}
