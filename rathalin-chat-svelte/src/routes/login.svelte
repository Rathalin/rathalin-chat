<script context="module">
	import { isAuthorized } from "$lib/guards/chat.guard";
	export async function load() {
		if (isAuthorized()) {
			chatService.disconnect();
		}
		return {};
	}
</script>

<script lang="ts">
	import ChatroomInputComponent from "$lib/components/chat/chatroom/ChatroomInputComponent.svelte";
	import LoginComponent from "$lib/components/chat/login/LoginComponent.svelte";
	import { connected, loggedIn } from "$lib/stores/user.store";
	import { _ } from "$lib/services/i18n/i18n.service";
	import { chatService } from "$lib/services/chat/chat.service";
	import { socketIoServerConnection } from "$lib/stores/config.store";
	import { onDestroy, onMount } from "svelte";
	import type { Subscription } from "rxjs";
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
			}),

			chatService.onConnectError.subscribe((error) => {
				console.log(
					`Failed connecting to ${$socketIoServerConnection}`
				);
				console.error(error);
				$connected = false;
			})
		);
	});

	onDestroy(() => {
		subscriptions.forEach((s) => s.unsubscribe());
	});
</script>

<svelte:head>
	<title>{$_("connection.login.label")} - {$_("app.name")}</title>
</svelte:head>

<div class="wrapper">
	<div class="row">
		<LoginComponent disabled={$connected && $loggedIn} />
	</div>
	{#if $connected && $loggedIn}
		<div class="row">
			<ChatroomInputComponent />
		</div>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
