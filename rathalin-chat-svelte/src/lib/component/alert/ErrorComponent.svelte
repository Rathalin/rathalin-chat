<script lang="ts">
    export let text: string = "";

    $: trimmedText = text.trim();
</script>

{#if trimmedText?.length > 0}
    <p>
        {text}
    </p>
{/if}

<style lang="scss">
    p {
        flex: 1;
        color: white;
        border-radius: var(--border-radius-s);
        background-color: var(--alert-danger);
        padding: 1em 1.5em;
        margin-bottom: 1em;
    }
</style>
