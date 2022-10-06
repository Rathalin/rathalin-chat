<script lang="ts">
    import { Jumper } from "svelte-loading-spinners";
    import {
        messageFadeInPosition,
        messageFadeInDuration,
    } from "$lib/stores/config.store";
    import { fly } from "svelte/transition";
    import { onlineUserNames } from "$lib/stores/user.store";
    import type { TextMessage } from "$lib/shared/message/content/TextMessage";

    export let textMessage: TextMessage;
    export let isMyMessage: boolean;
    export let isFollowUpMessage: boolean = false;
    let hover: boolean = false;
    let onlineIndicatorHidden: boolean = true;

    $: timestamp = new Date(textMessage.date).toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });

    function onMouseEnter(): void {
        hover = true;
    }

    function onMouseLeave(): void {
        hover = false;
    }

    onlineUserNames.subscribe(() => {
        onlineIndicatorHidden = !$onlineUserNames.includes(textMessage.sender);
    });
</script>

<li
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}
    class:hover
    class:follow-up-text-message={isFollowUpMessage}
    in:fly={{ x: $messageFadeInPosition, duration: $messageFadeInDuration }}
>
    <blockquote class:msg-me={isMyMessage}>
        {#if !isFollowUpMessage}
            <div class="name">
                <span> {textMessage.sender}</span>
                <span class:hidden={onlineIndicatorHidden}>
                    <Jumper
                        size="1"
                        unit="em"
                        color="var(--c-mgs-text-online-indicator)"
                        duration="3s"
                    />
                </span>
            </div>
        {/if}
        <div class="content">
            <span class="text">
                {textMessage.text}
            </span>
            <span class="timestamp">
                {timestamp}
            </span>
        </div>
    </blockquote>
</li>

<style lang="scss">
    li {
        display: flex;

        blockquote {
            position: relative;
            max-width: 95%;
            padding: 0.2em 0.8em 0.2em 0.8em;
            border-radius: 0 var(--border-radius-m) var(--border-radius-m)
                var(--border-radius-m);
            background-color: var(--c-msg-text);

            .name {
                font-size: 10pt;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.5em;

                & span {
                    opacity: 1;
                    transition-property: opacity;
                    transition-duration: 500ms;

                    &.hidden {
                        opacity: 0;
                    }
                }
            }

            .timestamp {
                font-size: 8pt;
                margin-left: 0.5em;
                opacity: 0.8;
            }

            .text {
                font-size: 11pt;
                word-break: break-word;
                white-space: pre-wrap;
                overflow-wrap: break-word;
                -ms-word-break: break-word;
                word-break: break-word;
            }

            .content {
                margin-top: -2px;
            }

            &::before {
                position: absolute;
                display: block;
                content: "";
                width: 0;
                height: 0;
                top: 0em;
                left: -0.4em;
                border-width: 0.4em;
                border-style: solid;
                border-color: var(--c-msg-text) var(--c-msg-text) transparent
                    transparent;
            }

            &.msg-me {
                background-color: var(--c-msg-text-me);

                &::before {
                    border-color: var(--c-msg-text-me) var(--c-msg-text-me)
                        transparent transparent;
                }
            }
        }

        @media (min-width: 600px) {
            max-width: 65%;
        }

        @media (min-width: 1200px) {
            max-width: 35%;
        }
    }

    li.follow-up-text-message blockquote {
        border-radius: var(--border-radius-m);

        &::before {
            border: none;
        }
    }
</style>
