<script lang="ts">
    import ChatComponent from "./ChatComponent.svelte";
    import LoginComponent from "./LoginComponent.svelte";    
	import { chatService } from "../../services/chat/chat.service";
	import { lastUsername, loggedIn } from "../../stores/user.store";
	import { socketIoServerConnection } from "../../stores/config.store";

	if (typeof localStorage !== "undefined") {
		$lastUsername = localStorage.getItem("lastUsername");
		lastUsername.subscribe(username => {
			if (username?.trim()?.length > 0) {
				localStorage.setItem("lastUsername", username);
				console.log("Set username in local storage to " + username);
			}
		});
	}

	chatService.onConnected.subscribe(() => {
		console.log(`Connected to ${$socketIoServerConnection}`);
		loggedIn.set(true);
	});

	chatService.onDisconnected.subscribe(() => {
		console.log(`Disconnected from to ${$socketIoServerConnection}`);
		loggedIn.set(false);
	});

	chatService.onError.subscribe((error) => {
		console.log(`Failed connecting to ${$socketIoServerConnection}`);
		console.error(error);
		loggedIn.set(false);
	});
</script>

{#if !$loggedIn}
    <LoginComponent />
{:else}
    <ChatComponent />
{/if}

<style>
</style>
