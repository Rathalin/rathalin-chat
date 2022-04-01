<script lang="ts">
	import { translate } from "../services/i18n/i18n.service";

	import ChatAuthComponent from "../lib/chat/ChatAuthComponent.svelte";
	import { selectedLocale } from "../stores/config.store";
</script>

<svelte:head>
	<title>{$translate("app.name")}</title>
	<html lang={$selectedLocale} />
</svelte:head>

<ChatAuthComponent />

<style lang="scss">
</style>
