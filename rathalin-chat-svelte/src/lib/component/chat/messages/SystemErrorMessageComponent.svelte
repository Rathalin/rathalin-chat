<script lang="ts">
    import {
        messageFadeInPosition,
        messageFadeInDuration,
    } from "$lib/stores/config.store";
    import { fly } from "svelte/transition";
    import type { SystemErrorMessage } from "$lib/shared/message/system/SystemErrorMessage";

    export let errorMessage: SystemErrorMessage;

    $: timestamp = errorMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li in:fly={{ x: $messageFadeInPosition, duration: $messageFadeInDuration }}>
    <blockquote>
        <span class="text">
            {errorMessage.text}
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
            background-color: red;
            color: white;

            .timestamp {
                font-size: 8pt;
                margin-left: 0.5em;
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }
</style>
