<script lang="ts">
    import type { SystemErrorMessage } from "../../../shared/messages/SystemErrorMessage";

    export let errorMessage: SystemErrorMessage;

    $: timestamp = errorMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li>
    <blockquote>
        <span class="text">
            {errorMessage.text}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
    </blockquote>
</li>

<style>
    li {
        list-style: none;
        align-self: center;
    }

    li:first-child {
        margin-top: 30px;
    }

    li:not(:last-child) {
        margin-bottom: 1em;
    }

    li:last-child {
        margin-bottom: 1em;
    }

    blockquote {
        padding: 0.3em 0.8em;
        margin: 0px;
        border-radius: 8px;
        white-space: pre;
        position: relative;
        font-size: 10pt;
        background-color: red;
        color: white;
    }

    .timestamp {
        font-size: 8pt;
        margin-left: 0.5em;
        color: rgba(255, 255, 255, 0.5);
    }
</style>
