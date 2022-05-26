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
	import { onMount, onDestroy } from "svelte";
	import type { Subscription } from "rxjs";
	import { chatService } from "$lib/services/chat/chat.service";
	import { socketIoServerConnection } from "$lib/stores/config.store";
	import { connected } from "$lib/stores/user.store";
import { goto } from "$app/navigation";

	const subscriptions: Subscription[] = [];

	onMount(() => {
		subscriptions.push(
			chatService.onConnect.subscribe(() => {
				console.log(`Connected to ${$socketIoServerConnection}`);
				$connected = true;
			}),

			chatService.onDisconnect.subscribe(() => {
				console.log(
					`Disconnected from to ${$socketIoServerConnection}`
				);
				$connected = false;
				goto("/login");
			}),

			chatService.onConnectError.subscribe((error) => {
				console.log(
					`Failed connecting to ${$socketIoServerConnection}`
				);
				console.error(error);
				$connected = false;
				goto("/login");
			})
		);
	});

	onDestroy(() => {
		subscriptions.forEach((s) => s.unsubscribe());
	});
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
