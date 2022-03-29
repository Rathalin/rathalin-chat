<script lang="ts">
    import { loggedIn } from "../../stores/user.store";
    import ChatComponent from "./ChatComponent.svelte";
    import LoginComponent from "./LoginComponent.svelte";
</script>

{#if !$loggedIn}
    <LoginComponent />
{:else}
    <ChatComponent />
{/if}

<style>
</style>
