<script lang="ts">
    import type { SystemWarningMessage } from "../../../shared/messages/SystemWarningMessage";

    export let warningMessage: SystemWarningMessage;

    $: timestamp = warningMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li>
    <blockquote>
        <span class="text">
            {warningMessage.text}
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
        background-color: yellow;
        color: black;
    }
</style>
