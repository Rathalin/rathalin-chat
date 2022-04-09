<script lang="ts">
	import { chatService } from "$lib/services/chat/chat.service";
	import { socketIoServerConnection } from "$lib/stores/config.store";
	import { connected, lastUsername, loggedIn } from "$lib/stores/user.store";
	import ChatComponent from "./ChatComponent.svelte";
	import ChatroomMenuComponent from "./chatroom/ChatroomMenuComponent.svelte";
	import LoginComponent from "./login/LoginComponent.svelte";

	let selectedChatroom: string | null = null;

	if (typeof localStorage !== "undefined") {
		$lastUsername = localStorage.getItem("lastUsername") ?? "";
		lastUsername.subscribe((username) => {
			if (username?.trim()?.length > 0) {
				localStorage.setItem("lastUsername", username);
				console.log("Set username in local storage to " + username);
			}
		});
	}

	chatService.onConnect.subscribe(() => {
		console.log(`Connected to ${$socketIoServerConnection}`);
		$connected = true;
	});

	chatService.onDisconnect.subscribe(() => {
		console.log(`Disconnected from to ${$socketIoServerConnection}`);
		$connected = false;
		$loggedIn = false;
	});

	chatService.onError.subscribe((error) => {
		console.log(`Failed connecting to ${$socketIoServerConnection}`);
		console.error(error);
		$connected = false;
		$loggedIn = false;
	});
</script>

{#if !$connected || !$loggedIn}
	<LoginComponent />
{:else if selectedChatroom == null}
	<ChatroomMenuComponent />
{:else}
	<ChatComponent />
{/if}

<style lang="scss">
</style>
