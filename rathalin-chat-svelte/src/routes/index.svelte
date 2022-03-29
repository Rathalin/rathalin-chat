<script lang="ts">
	import { chatService } from "../services/chat/chat.service";

	import {
		locale,
		setupI18n,
		translate,
	} from "../services/i18n/i18n.service";

	import { socketIoServerConnection } from "../stores/connection.store";
	import { lastUsername, loggedIn } from "../stores/user.store";

	import ChatAuthComponent from "../lib/chat/ChatAuthComponent.svelte";

	if (typeof localStorage !== "undefined") {
		lastUsername.subscribe((username) => {
			localStorage.setItem("lastUsername", username);
			console.log("Set username in local storage to " + username);
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

<svelte:head>
	<title>{$translate("app.name")}</title>
	<html lang="en" />
	<!-- <script src="http://localhost:5001/socket.io/socket.io.js"></script> -->
</svelte:head>

<ChatAuthComponent />

<style>
	:root {
		/* CSS HEX */
		--dark-purple: #16001eff;
		--glaucous: #7180acff;
		--light-blue: #a8d0dbff;
		--red-crayola: #ed254eff;
		--naples-yellow: #f9dc5cff;
		--primary: #212121;
		--primary-light: #2f2f2f;
		--primary-lighter: #585858;
		--primary-dark: rgb(28, 28, 28);
		--primary-darker: #000000;
		--secondary: #ff6f00;
		--secondary-light: #ffa040;
		--secondary-dark: #c43e00;
		--alert-success: #d4edda;
		--alert-primary: #585858;
		--alert-secondary: #ffa040;
		--alert-success: #d4edda;
		--alert-danger: #851a24;
		--alert-warning: #fff3cd;
		--alert-info: #d1ecf1;
		--alert-light: #fefefe;
		--alert-dark: #d6d8d9;
	}

	:global(body) {
		background-color: var(--primary) !important;
		color: white !important;
		font-family: "Roboto", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
</style>
