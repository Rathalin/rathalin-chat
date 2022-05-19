<script lang="ts">
    import { goto } from "$app/navigation";
    import { chatService } from "$lib/services/chat/chat.service";
    import { _ } from "$lib/services/i18n/i18n.service";
    import { chatroom, inChatroom } from "$lib/stores/user.store";

    async function exit(): Promise<void> {
        console.log(`Leaving chatroom '${$chatroom}`);
        if ($chatroom != null) {
            await chatService.leaveChatroom($chatroom);
            goto("/login");
        }
        $chatroom = null;
    }
</script>

{#if $inChatroom}
    <button id="exit-button" on:click={exit}
        >{$_("chatroom.change.label")}</button
    >
{/if}

<style lang="scss">
    button#exit-button {
        cursor: pointer;
        background-color: transparent;
        color: var(--secondary-light);
        font-weight: 300;
        border: none;
        padding: 0em;
        margin: 0em;
        text-transform: uppercase;

        &:hover {
            color: var(--secondary-dark);
        }

        &:focus {
            color: var(--secondary-dark);
        }
    }
</style>
