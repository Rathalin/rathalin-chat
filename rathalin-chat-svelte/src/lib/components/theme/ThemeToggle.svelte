<script lang="ts">
    import { browser } from "$app/env";
    import { onMount } from "svelte";

    export const storageKey: string = "theme-preference";

    type ThemeValue = "light" | "dark";
    type ThemePreference = "system" | ThemeValue;

    const attributeKey: string = "data-theme";
    const themePreferences: ThemePreference[] = ["system", "light", "dark"];
    let themePreference: ThemePreference = "light";
    onMount(() => {
        themePreference = getThemePreference();
        reflectPreference();
    });

    function onClick(): void {
        themePreference = getNextThemePreference();
        setThemePreference();
    }

    function getNextThemePreference(): ThemePreference {
        return themePreferences[
            (themePreferences.indexOf(themePreference) + 1) %
                themePreferences.length
        ];
    }

    function getThemePreference(): ThemePreference {
        if (browser) {
            const storageValue: string | null =
                localStorage?.getItem(storageKey);
            if (storageValue != null && isThemePreference(storageValue)) {
                return storageValue;
            }
        }
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
        return "light";
    }

    function getThemeValue(): ThemeValue {
        if (themePreference === "system") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                console.log("dark");
                return "dark";
            }
            console.log("light");
            return "light";
        }
        console.log(themePreference);
        return themePreference;
    }

    function setThemePreference(): void {
        if (browser) {
            localStorage?.setItem(storageKey, themePreference);
        }
        reflectPreference();
    }

    function reflectPreference(): void {
        document.firstElementChild?.setAttribute(attributeKey, getThemeValue());
    }

    function isThemePreference(str: string): str is ThemePreference {
        return ["system", "light", "dark"].includes(str);
    }
</script>

<button on:click={onClick} aria-label={themePreference}
    >{themePreference}</button
>
