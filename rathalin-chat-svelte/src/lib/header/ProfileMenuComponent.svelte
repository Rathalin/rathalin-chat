<script lang="ts">
    import { loggedIn, user } from "../../stores/user.store";
</script>

{#if $loggedIn}
    <div>{$user?.name}</div>
{/if}

<style lang="scss">
</style>
