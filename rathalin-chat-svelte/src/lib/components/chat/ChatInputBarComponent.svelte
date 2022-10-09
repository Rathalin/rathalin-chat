<script lang="ts">
    import type { Username } from "$lib/shared/message/user/Username";
    import { user } from "$lib/stores/user.store";
    import Send from "svelte-material-icons/Send.svelte";
    import { createEventDispatcher } from "svelte";
    import { _ } from "svelte-i18n";

    let dispatch = createEventDispatcher<{
        message: { text: string; sender: Username };
    }>();

    let text: string = "";
    let inputEl: HTMLInputElement;
    let myUsername: Username;
    
    user.subscribe((u) => (myUsername = u?.name ?? ""));

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
        focusInput();
    }

    function inputKeyDown(event: KeyboardEvent) {
        if (event.key !== "Enter") return;
        sendMessage();
    }

    function focusInput(): void {
        inputEl.focus();
    }
</script>

<svelte:window on:keydown={focusInput} />

<div id="chat-input-wrapper" on:click={focusInput}>
    <!-- svelte-ignore a11y-autofocus -->
    <input
        bind:this={inputEl}
        bind:value={text}
        on:keydown={inputKeyDown}
        placeholder={$_("chat.input.placeholder")}
        type="text"
        name="chat-input"
        id="chat-input"
        autofocus
    />
    <button id="send-message-button" class="no-outline" on:click={sendMessage}>
        <span class="flex-row">
            <Send size="1.5em" />
        </span>
    </button>
</div>

<style lang="scss">
    #chat-input-wrapper {
        box-shadow: 0px 12px 14px 5px hwb(0 0% 100%);
        padding: 0.8em 0.5em;
        display: flex;
        flex-direction: row;
        background-color: var(--c-msg-input);
    }

    input {
        padding: 0em 0.5em;
        font-size: 11pt;
        margin: 0em;
        flex-grow: 1;
        border-width: 0px;
        background-color: transparent;
        outline: none;
        font-weight: var(--font-weight-semibold);
    }
</style>
