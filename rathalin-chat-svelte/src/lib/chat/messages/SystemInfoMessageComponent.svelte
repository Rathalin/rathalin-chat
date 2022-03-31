<script lang="ts">
    import type { SystemInfoMessage } from "../../../shared/messages/SystemInfoMessage";

    export let infoMessage: SystemInfoMessage;

    $: timestamp = infoMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li>
    <blockquote>
        <span class="text">
            {infoMessage.text}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
    </blockquote>
</li>

<style lang="scss">
    @import "./messages.scss";

    li {
        align-self: center;

        blockquote {
            padding: 0.3em 0.8em;
            font-size: 10pt;
            background-color: var(--primary-lighter);
            color: white;

            .timestamp {
                font-size: 8pt;
                margin-left: 0.5em;
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }
</style>
