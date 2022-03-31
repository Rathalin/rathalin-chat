<script lang="ts">
	import ChatComponent from "./ChatComponent.svelte";
	import { chatService } from "../../services/chat/chat.service";
	import { lastUsername, connected, loggedIn } from "../../stores/user.store";
	import { socketIoServerConnection } from "../../stores/config.store";
	import LoginComponent from "./login/LoginComponent.svelte";

	if (typeof localStorage !== "undefined") {
		$lastUsername = localStorage.getItem("lastUsername");
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
{:else}
	<ChatComponent />
{/if}

<style lang="scss">
</style>
