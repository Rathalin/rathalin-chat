<script lang="ts">
    import { translate } from "../../../services/i18n/i18n.service";
    import { inChatroom, loggedIn } from "../../../stores/user.store";

    function exit(): void {
        
    }
</script>

{#if $loggedIn && $inChatroom != null}
    <button id="exit-button" on:click={exit}
        >{$translate("connection.exit.label")}</button
    >
{/if}

<style lang="scss">
</style>
