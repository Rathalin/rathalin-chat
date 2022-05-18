<script lang="ts">
    import type { Username } from "$lib/shared/message/user/Username";
    import { user } from "$lib/stores/user.store";

    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    let dispatch = createEventDispatcher<{
        message: { text: string; sender: Username };
    }>();

    let text: string = "";
    let inputEl: HTMLInputElement;
    let myUsername: Username;
    user.subscribe((u) => (myUsername = u?.name ?? ""));

    /**
     * Raises the message event
     */
    function sendMessage(): void {
        const messageText: string = text.trim();

        if (messageText.length > 0) {
            const message: { text: string; sender: Username } = {
                sender: myUsername,
                text: messageText,
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
        // TODO
        // window.addEventListener("keydown", focusInput);
    });

    onDestroy(() => {
        // TODO
        // window.removeEventListener("keydown", focusInput);
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
        font-family: var(--font-secondary);
        padding: 0em 0.5em;
        font-size: 11pt;
        margin: 0em;
        flex-grow: 1;
        border-width: 0px;
        background-color: transparent;
        color: white;
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
</style>
