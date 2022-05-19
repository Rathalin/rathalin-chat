<script lang="ts">
    import { chatroom, loggedIn, user } from "$lib/stores/user.store";
</script>

<div class="flex-row">
    <div>
        {#if $loggedIn}
            <span>{$user?.name}</span>
        {/if}
        {#if $chatroom}
            <span>in</span>
            <span>{$chatroom}</span>
        {/if}
    </div>
</div>
