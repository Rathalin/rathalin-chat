<script lang="ts">
    import { Circle2 } from "svelte-loading-spinners";

    export let text: string = "";

    $: trimmedText = text.trim();
</script>

<p>
    {#if trimmedText?.length > 0}
        <span class="text">{text}</span>
    {/if}
    <Circle2
        size="1.8"
        unit="em"
        colorOuter="#23DBA9"
        colorCenter="#C738DB"
        colorInner="#DBB74F"
    />
</p>

<style lang="scss">
    p {
        flex: 1;
        display: flex;
        justify-content: center;
        gap: 1em;
        color: white;
        border-radius: var(--border-radius-s);
        background-color: var(--alert-primary);
        padding: 1em 1.5em;
        text-transform: uppercase;
    }
</style>
