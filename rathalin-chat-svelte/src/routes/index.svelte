<script lang="ts">
	import { translate } from "../services/i18n/i18n.service";

	import ChatAuthComponent from "../lib/chat/ChatAuthComponent.svelte";
</script>

<svelte:head>
	<title>{$translate("app.name")}</title>
	<html lang="en" />
</svelte:head>

<ChatAuthComponent />

<style>
</style>
