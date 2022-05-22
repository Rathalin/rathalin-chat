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
        padding: 1em 1.5em;
        margin-bottom: 1em;
        color: var(--c-text-light);
        border-radius: var(--border-radius-s);
        background-color: var(--c-error);
    }
</style>
