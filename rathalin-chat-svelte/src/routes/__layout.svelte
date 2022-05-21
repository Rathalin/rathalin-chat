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
    import { selectedLocale } from "$lib/stores/locale.store";
    import "$lib/styles/app.scss";
    import { _ } from "svelte-i18n";
</script>

<svelte:head>
    <meta name="description" content={$_("app.description")} />
    <meta name="keywords" content={$_("app.keywords")} />
</svelte:head>
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