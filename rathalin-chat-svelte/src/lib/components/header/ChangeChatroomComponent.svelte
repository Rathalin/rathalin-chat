<script lang="ts">
    import { goto } from "$app/navigation";
    import { chatService } from "$lib/services/chat/chat.service";
    import { _ } from "$lib/services/i18n/i18n.service";
    import { chatroom, inChatroom } from "$lib/stores/user.store";
    import Pencil from "svelte-material-icons/Pencil.svelte";

    async function exit(): Promise<void> {
        console.log(`Leaving chatroom '${$chatroom}`);
        if ($chatroom != null) {
            await chatService.leaveChatroom($chatroom);
        }
        $chatroom = null;
        goto("/login");
    }
</script>

{#if $inChatroom}
    <button id="exit-button" class="no-outline" on:click={exit}>
        <span class="wrap">{$chatroom}</span>
        <Pencil />
    </button>
{/if}
