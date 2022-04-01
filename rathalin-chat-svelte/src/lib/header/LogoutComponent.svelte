<script lang="ts">
    import { SocketEventEnum } from "../../shared/events/SocketEventEnum";
    import { chatService } from "../../services/chat/chat.service";
    import { translate } from "../../services/i18n/i18n.service";
    import { loggedIn, user } from "../../stores/user.store";

    function logout(): void {
        chatService.logout({
            type: SocketEventEnum.LOGOUT,
            user: { username: $user.usernamep },
            date: new Date(),
        });
        chatService.disconnect();
    }
</script>

{#if $loggedIn}
    <button id="exit-button" on:click={logout}
        >{$translate("connection.exit_label")}</button
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
