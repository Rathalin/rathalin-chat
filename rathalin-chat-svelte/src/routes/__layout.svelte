<script lang="ts" context="module">
    import { locale, setupI18n } from "../services/i18n/i18n.service";
    import { selectedLocale } from "../stores/config.store";

    export async function load() {
        const localeString: string = "en";
        selectedLocale.set(localeString);
        setupI18n(localeString);
        selectedLocale.subscribe((lang) => locale.set(lang));
        return {};
    }
</script>

<script lang="ts">
    import HeaderComponent from "$lib/header/HeaderComponent.svelte";
    import "../app.css";
</script>

<HeaderComponent />
<main>
    <slot />
</main>

<style>
    main {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
