<script lang="ts" context="module">
    export async function load() {
        setupI18n();
        selectedLocale.subscribe((lang) => locale.set(lang));
        return {};
    }
</script>

<script lang="ts">
    import HeaderComponent from "$lib/components/header/HeaderComponent.svelte";
    import { locale, setupI18n } from "$lib/services/i18n/i18n.service";
    import { selectedLocale } from "$lib/stores/config.store";
    import "$lib/styles/app.scss";
</script>

<HeaderComponent />
<main>
    <slot />
</main>

<style lang="scss">
    main {
        overflow: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
    }
</style>