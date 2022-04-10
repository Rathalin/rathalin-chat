<script lang="ts">
    import { chatroom, loggedIn, user } from "$lib/stores/user.store";
</script>

<div class="flex-row gap">
    {#if $loggedIn}
        <div>{$user?.name}</div>
    {/if}
    {#if $chatroom}
        <div>{$chatroom}</div>
    {:else}
        <div>No Room</div>
    {/if}
</div>

<style lang="scss">
</style>
