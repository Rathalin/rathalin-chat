<script lang="ts">
    import type { Chatroom } from "../../shared/message/Chatroom";

    export let chatrooms: Chatroom[] = [];
</script>

<div class="container">
    <ul>
        {#each chatrooms as chatroom}
            <li>{chatroom}</li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .container {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    ul {
        max-width: 400px;
        padding: 1em;
        background-color: var(--secondary);
    }
</style>
