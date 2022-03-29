<script lang="ts">
    import type { TextMessage } from "../../../shared/messages/TextMessage";

    export let textMessage: TextMessage;
    export let isMyMessage: boolean;

    $: timestamp = textMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li>
    <blockquote class:msg-me={isMyMessage}>
        <span class="name">
            {textMessage.sender.username}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
        <div class="text">
            {textMessage.text}
        </div>
    </blockquote>
</li>

<style>
    li {
        list-style: none;
        display: flex;
    }

    li:first-child {
        margin-top: 30px;
    }

    li:not(:last-child) {
        margin-bottom: 0.5em;
    }

    li:last-child {
        margin-bottom: 1em;
    }

    blockquote {
        padding: 0.3em 1em 0.5em 1em;
        margin: 0px;
        color: white;
        border-radius: 0px 8px 8px 8px;
        white-space: pre;
        background-color: var(--primary-light);
        /* width: fit-content; */
        position: relative;
        max-width: 35%;
    }

    blockquote::before {
        position: absolute;
        display: block;
        content: "";
        width: 0;
        height: 0;
        top: 0em;
        left: -0.8em;
        border: 0.4em solid var(--primary-light);
        border-color: var(--primary-light) var(--primary-light) transparent
            transparent;
    }

    blockquote.msg-me {
        background-color: var(--primary-lighter);
    }

    blockquote.msg-me::before {
        border-color: var(--primary-lighter) var(--primary-lighter) transparent
            transparent;
    }

    .name {
        font-size: 10pt;
        font-weight: bold;
        color: var(--secondary-light);
    }

    .timestamp {
        font-size: 8pt;
        margin-left: 0.5em;
        color: rgba(255, 255, 255, 0.5);
    }

    .text {
        font-size: 11pt;
        word-break: break-word;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        -ms-word-break: break-word;
        word-break: break-word;
    }

    @media (max-width: 1000px) {
        blockquote {
            max-width: 95%;
        }

        .name {
            font-size: 11pt;
        }

        .timestamp {
            font-size: 9pt;
        }

        .text {
            font-size: 12pt;
        }
    }
</style>
