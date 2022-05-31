<script lang="ts">
    import { goto } from "$app/navigation";
    import { chatService } from "$lib/services/chat/chat.service";
    import { _ } from "$lib/services/i18n/i18n.service";
    import { loggedIn, user } from "$lib/stores/user.store";
    import Pencil from "svelte-material-icons/Pencil.svelte";

    function exit(): void {
        chatService.disconnect();
        goto("/login");
    }
</script>

{#if $loggedIn}
    <button id="exit-button" class="no-outline" on:click={exit}>
        <span class="wrap">{$user?.name}</span>
        <Pencil />
    </button>
{/if}
