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
    import { theme } from "$lib/stores/theme.store";
    import { _ } from "svelte-i18n";

    export const storageKey: string = "theme-preference";

    const themeIconSize: string = "1.6em";
    const attributeKey: string = "data-theme";
    let themePreference: ThemePreference = "system";
    const themePreferences: ThemePreference[] = ["system", "light", "dark"];

    onMount(() => {
        themePreference = getThemePreference();
        reflectPreference();
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", () => {
                if (themePreference === "system") {
                    setThemePreference();
                }
            });
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
        return "system";
    }

    function getTheme(): Theme {
        if (themePreference === "system") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
            return "light";
        }
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

<button
    on:click={onClick}
    id="theme-toggle-button"
    class="no-outline"
    aria-label={themePreference}
    title={$_(
        "theme.toggle_button.title." +
            (themePreference === "system"
                ? "system"
                : themePreference === "light"
                ? "light"
                : "dark")
    )}
>
    {#if themePreference === "system"}
        <ThemeLightDark size={themeIconSize} />
    {:else if themePreference === "light"}
        <WhiteBalanceSunny size={themeIconSize} />
    {:else}
        <MoonWaningCrescent size={themeIconSize} />
    {/if}
</button>

<style lang="scss">
    #theme-toggle-button {
        color: var(--c-theme-toggle);

        &:hover {
        color: var(--c-theme-toggle-hover);
        }
    }
</style>
