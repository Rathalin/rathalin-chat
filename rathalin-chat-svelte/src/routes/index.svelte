<script lang="ts">
	import ChatAuthComponent from "$lib/component/chat/ChatAuthComponent.svelte";
	import { translate } from "$lib/services/i18n/i18n.service";
</script>

<svelte:head>
	<title>{$translate("app.name")}</title>
</svelte:head>

<ChatAuthComponent />

<style lang="scss">
</style>
