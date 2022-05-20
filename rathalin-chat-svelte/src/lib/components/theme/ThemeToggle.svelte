<script lang="ts">
    import { browser } from "$app/env";
    import { onMount } from "svelte";
    import WhiteBalanceSunny from "svelte-material-icons/WhiteBalanceSunny.svelte";
    import MoonWaningCrescent from "svelte-material-icons/MoonWaningCrescent.svelte";
    import ThemeLightDark from "svelte-material-icons/ThemeLightDark.svelte";
    import {
        type ThemePreference,
        isThemePreference,
    } from "$lib/types/ThemePreference";
    import type { Theme } from "$lib/types/Theme";
    import { iconSize, theme } from "$lib/stores/theme.store";

    export const storageKey: string = "theme-preference";

    const attributeKey: string = "data-theme";
    let themePreference: ThemePreference = "system";
    const themePreferences: ThemePreference[] = ["system", "light", "dark"];
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

    function getTheme(): Theme {
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
        const themeValue: Theme = getTheme();
        $theme = themeValue;
        document.firstElementChild?.setAttribute(attributeKey, themeValue);
    }
</script>

<button on:click={onClick} class="link" aria-label={themePreference}>
    {#if themePreference === "system"}
        <ThemeLightDark size={$iconSize} />
    {:else if themePreference === "light"}
        <WhiteBalanceSunny size={$iconSize} />
    {:else}
        <MoonWaningCrescent size={$iconSize} />
    {/if}
</button>
