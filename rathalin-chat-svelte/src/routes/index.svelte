<script lang="ts">
	import ChatAuthComponent from "$lib/component/chat/ChatAuthComponent.svelte";
	import { translate } from "$lib/services/i18n/i18n.service";
	import { selectedLocale } from "$lib/stores/config.store";
</script>

<!-- <svelte:head>
	<title>{$translate("app.name")}</title>
	<html lang={$selectedLocale} />
</svelte:head> -->

<ChatAuthComponent />

<style lang="scss">
</style>
