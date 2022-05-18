<script lang="ts">
	import ChatroomInputComponent from "$lib/components/chat/chatroom/ChatroomInputComponent.svelte";
	import LoginComponent from "$lib/components/chat/login/LoginComponent.svelte";

	import { chatService } from "$lib/services/chat/chat.service";
	import { socketIoServerConnection } from "$lib/stores/config.store";
	import { connected, inChatroom, loggedIn } from "$lib/stores/user.store";
	import ChatComponent from "./ChatComponent.svelte";

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

{#if !$connected || !$loggedIn || !$inChatroom}
	<LoginComponent disabled={$connected && $loggedIn} />
	<ChatroomInputComponent disabled={!$connected || !$loggedIn} />
{:else}
	<ChatComponent />
{/if}
