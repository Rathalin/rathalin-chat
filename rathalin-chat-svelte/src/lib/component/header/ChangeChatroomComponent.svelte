<script lang="ts">
    import { translate } from "$lib/services/i18n/i18n.service";
    import { chatroom, inChatroom } from "$lib/stores/user.store";

    function exit(): void {
        // Leave chatroom
        $chatroom = null;
    }
</script>

{#if $inChatroom}
    <button id="exit-button" on:click={exit}
        >{$translate("chatroom.change.label")}</button
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
