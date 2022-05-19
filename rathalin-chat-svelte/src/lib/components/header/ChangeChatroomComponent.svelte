<script lang="ts">
    import { goto } from "$app/navigation";
    import { chatService } from "$lib/services/chat/chat.service";
    import { _ } from "$lib/services/i18n/i18n.service";
    import { chatroom, inChatroom } from "$lib/stores/user.store";

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
    <button id="exit-button" on:click={exit}
        >{$_("chatroom.change.label")}</button
    >
{/if}
