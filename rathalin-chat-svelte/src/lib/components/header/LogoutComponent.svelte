<script lang="ts">
import { goto } from "$app/navigation";

    import { chatService } from "$lib/services/chat/chat.service";
    import { _ } from "$lib/services/i18n/i18n.service";
    import { loggedIn } from "$lib/stores/user.store";

    function exit(): void {
        chatService.disconnect();
        goto("/login");
    }
</script>

{#if $loggedIn}
    <button id="exit-button" on:click={exit}
        >{$_("connection.disconnect.label")}</button
    >
{/if}

