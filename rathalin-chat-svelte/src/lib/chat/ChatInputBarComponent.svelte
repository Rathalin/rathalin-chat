<script lang="ts">
    import type { TextMessage } from "../../shared/messages/TextMessage";

    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { user } from "../../stores/user.store";
    import { SocketEventEnum } from "../../shared/events/SocketEventEnum";

    let dispatch = createEventDispatcher<{ message: TextMessage }>();

    let text: string = "";
    let inputEl: HTMLInputElement;
    let myUsername: string;
    user.subscribe((user) => (myUsername = user?.username));

    /**
     * Raises the message event
     */
    function sendMessage(): void {
        const messageText: string = text.trim();

        if (messageText.length > 0) {
            const message: TextMessage = {
                type: SocketEventEnum.TEXT_MESSAGE,
                sender: {
                    username: myUsername,
                },
                text: messageText,
                date: new Date(),
            };

            dispatch("message", message);
        }

        text = "";
        inputEl.focus();
    }

    /**
     * Hangle keydown of input
     * @param event KeyboardEvent
     */
    function inputKeyDown(event: KeyboardEvent) {
        if (event.key !== "Enter") return;

        sendMessage();
    }

    function focusInput(): void {
        inputEl.focus();
    }

    onMount(() => {
        window.addEventListener("keydown", focusInput);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", focusInput);
    });
</script>

<div id="chat-input-wrapper" on:click={focusInput}>
    <!-- svelte-ignore a11y-autofocus -->
    <input
        bind:this={inputEl}
        bind:value={text}
        on:keydown={inputKeyDown}
        type="text"
        name="chat-input"
        id="chat-input"
        autofocus
    />
    <button on:click={sendMessage}>
        <!-- <img
			width="24"
			height="24"
			src="images/icons/send-arrow-orange.png"
			alt="Send Arrow"
		/> -->
        <i class="material-icons">send</i>
    </button>
</div>

<style lang="scss">
    #chat-input-wrapper {
        padding: 5px;
        width: 100%;
        background-color: var(--primary-light);
        display: flex;
        flex-direction: row;
    }

    input {
        margin: 0em;
        flex-grow: 1;
        border-width: 0px;
        background-color: transparent;
        color: white;
        font-size: small;
        outline: none;
    }

    button {
        background-color: transparent;
        border: none;
        padding: 0;
        margin: 0;

        &:hover,
        &:focus {
            background-color: transparent;
        }

        i {
            margin: 8px;
            color: var(--secondary-light);
        }
    }

    @media (max-width: 700px) {
        input {
            font-size: initial;
        }
    }
</style>
