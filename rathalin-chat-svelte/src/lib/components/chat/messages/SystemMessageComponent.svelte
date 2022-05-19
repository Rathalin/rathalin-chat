<script lang="ts">
import type { SystemMessage } from "$lib/shared/message/system/SystemMessage";

    import {
        messageFadeInPosition,
        messageFadeInDuration,
    } from "$lib/stores/config.store";
    import { fly } from "svelte/transition";

    export let systemMessage: SystemMessage;

    $: timestamp = new Date(systemMessage.date).toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li in:fly={{ x: $messageFadeInPosition, duration: $messageFadeInDuration }}>
    <blockquote>
        <span class="text">
            {systemMessage.text}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
    </blockquote>
</li>

<style lang="scss">
    li {
        align-self: center;

        blockquote {
            padding: 0.3em 0.8em;
            font-size: 10pt;
            background-color: var(--c-second);
            color: var(--c-text-prime);

            .timestamp {
                font-size: 8pt;
                margin-left: 0.5em;
                opacity: 0.5;
            }
        }
    }
</style>
