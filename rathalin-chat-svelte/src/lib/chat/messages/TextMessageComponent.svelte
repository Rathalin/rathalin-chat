<script lang="ts">
    import { Jumper } from "svelte-loading-spinners";
    import { fade } from "svelte/transition";
    import {
        messageFadeInPosition,
        messageFadeInDuration,
    } from "../../../stores/config.store";
    import { fly } from "svelte/transition";
    import type { TextMessage } from "../../../shared/messages/content/TextMessage";
    import { onlineUserNames } from "../../../stores/user.store";

    export let textMessage: TextMessage;
    export let isMyMessage: boolean;
    export let isFollowUpMessage: boolean = false;
    let hover: boolean = false;
    let onlineIndicatorHidden: boolean = true;

    $: timestamp = textMessage.date.toLocaleTimeString("at-AT", {
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
                    <Jumper size="1" unit="em" color="#00FF00" duration="3s" />
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
        font-family: var(--font-secondary);
        font-weight: 400;
        display: flex;

        blockquote {
            max-width: 95%;
            padding: 0.2em 0.8em 0.2em 0.8em;
            color: white;
            border-radius: 0px 8px 8px 8px;
            background-color: var(--primary-light);

            .name {
                font-family: var(--font-secondary);
                font-size: 10pt;
                color: var(--secondary-light);
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
                font-family: var(--font-secondary);
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

            .content {
                margin-top: -5px;
            }

            &::before {
                position: absolute;
                display: block;
                content: "";
                width: 0;
                height: 0;
                top: 0em;
                left: -0.4em;
                border: 0.4em solid var(--primary-light);
                border-color: var(--primary-light) var(--primary-light)
                    transparent transparent;
            }

            &.msg-me {
                background-color: var(--primary-lighter);

                &::before {
                    border-color: var(--primary-lighter) var(--primary-lighter)
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
        border-radius: 8px 8px 8px 8px;

        &::before {
            border: none;
        }
    }
</style>
