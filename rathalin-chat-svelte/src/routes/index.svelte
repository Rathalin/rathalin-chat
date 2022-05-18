<script context="module">
	import { isAuthorized } from "$lib/guards/chat.guard";
	export async function load() {
		if (!isAuthorized()) {
			return {
				status: 302,
				redirect: "/login",
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import ChatComponent from "$lib/components/chat/ChatComponent.svelte";
	import { _ } from "$lib/services/i18n/i18n.service";
</script>

<svelte:head>
	<title>{$_("app.name")}</title>
</svelte:head>

<div class="wrapper">
	<ChatComponent />
</div>

<style lang="scss">
	.wrapper {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
