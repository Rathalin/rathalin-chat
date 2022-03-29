<script lang="ts">
    import { chatService } from "../../services/chat/chat.service";

    import { translate } from "../../services/i18n/i18n.service";
    import { loggedIn, user } from "../../stores/user.store";

    function logout(): void {
        chatService.logout({
            user: { username: $user.username },
            date: new Date(),
        });
        chatService.disconnect();
    }
</script>

<div id="profile-menu-wrapper">
    {#if $loggedIn}
        <div>{$user.username}</div>
        <button id="exit-button" on:click={logout}
            >{$translate("connection.exit_label")}</button
        >
    {/if}
</div>

<style>
    #profile-menu-wrapper {
        display: flex;
        flex-direction: row;
    }

    div {
        padding-right: 1em;
    }

    #exit-button {
        cursor: pointer;
        background-color: transparent;
        color: var(--secondary-light);
        font-weight: 300;
        border: none;
        padding: 0em;
        margin: 0em;
        text-transform: uppercase;
    }

    #exit-button:hover {
        color: var(--secondary-dark);
    }

    #exit-button:focus {
        color: var(--secondary-dark);
    }
</style>
