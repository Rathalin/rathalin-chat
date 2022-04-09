<script lang="ts">
    import { chatService } from "$lib/services/chat/chat.service";
    import { translate } from "$lib/services/i18n/i18n.service";
    import { loggedIn } from "$lib/stores/user.store";

    function exit(): void {
        chatService.disconnect();
    }
</script>

{#if $loggedIn}
    <button id="exit-button" on:click={exit}
        >{$translate("connection.disconnect.label")}</button
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
