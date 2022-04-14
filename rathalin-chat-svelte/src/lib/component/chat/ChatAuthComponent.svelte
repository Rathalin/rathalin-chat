<script lang="ts">
	import { chatService } from "$lib/services/chat/chat.service";
	import { socketIoServerConnection } from "$lib/stores/config.store";
	import {
		connected,
		inChatroom,
		loggedIn,
	} from "$lib/stores/user.store";
	import ChatComponent from "./ChatComponent.svelte";
	import ChatroomMenuComponent from "./chatroom/ChatroomMenuComponent.svelte";
	import LoginComponent from "./login/LoginComponent.svelte";

	chatService.onConnect.subscribe(() => {
		console.log(`Connected to ${$socketIoServerConnection}`);
		$connected = true;
	});

	chatService.onDisconnect.subscribe(() => {
		console.log(`Disconnected from to ${$socketIoServerConnection}`);
		$connected = false;
	});

	chatService.onConnectError.subscribe((error) => {
		console.log(`Failed connecting to ${$socketIoServerConnection}`);
		console.error(error);
		$connected = false;
	});
</script>

{#if !$connected || !$loggedIn}
	<LoginComponent />
{:else if !$inChatroom}
	<ChatroomMenuComponent />
{:else}
	<ChatComponent />
{/if}
