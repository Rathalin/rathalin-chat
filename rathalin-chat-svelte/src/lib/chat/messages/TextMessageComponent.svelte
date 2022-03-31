<script lang="ts">
    import type { TextMessage } from "../../../shared/messages/TextMessage";

    export let textMessage: TextMessage;
    export let isMyMessage: boolean;
    let hover: boolean = false;

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
</script>

<li on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave} class:hover>
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

<style lang="scss">
    @import "./messages.scss";
    
    li {
        font-family: "Roboto";
        display: flex;

        blockquote {
            padding: 0.4em .8em 0.4em .8em;
            color: white;
            border-radius: 0px 8px 8px 8px;
            background-color: var(--primary-light);
            max-width: 35%;            

            .name {
                font-size: 11pt;
                color: var(--secondary-light);
            }

            .timestamp {
                font-size: 9pt;
                margin-left: 0.5em;
                color: rgba(255, 255, 255, 0.5);
            }

            .text {
                font-size: 12pt;
                word-break: break-word;
                white-space: pre-wrap;
                overflow-wrap: break-word;
                -ms-word-break: break-word;
                word-break: break-word;
            }

            &::before {
                position: absolute;
                display: block;
                content: "";
                width: 0;
                height: 0;
                top: 0em;
                left: -0.8em;
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

        .hover {
            color: red;
        }
    }

    @media (max-width: 1000px) {
        blockquote {
            max-width: 95%;
        }

        // .name {
        //     font-size: 11pt;
        // }

        // .timestamp {
        //     font-size: 9pt;
        // }

        // .text {
        //     font-size: 12pt;
        // }
    }
</style>
