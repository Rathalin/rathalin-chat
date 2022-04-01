<script lang="ts" context="module">
    import { locale, setupI18n } from "../services/i18n/i18n.service";
    import { selectedLocale } from "../stores/config.store";

    export async function load() {
        setupI18n();
        selectedLocale.subscribe((lang) => locale.set(lang));
        return {};
    }
</script>

<script lang="ts">
    import HeaderComponent from "$lib/header/HeaderComponent.svelte";
    import "../styles/app.scss";
</script>

<HeaderComponent />
<main>
    <slot />
</main>

<style lang="scss">
    main {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
