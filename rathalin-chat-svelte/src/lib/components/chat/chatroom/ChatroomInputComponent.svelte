<script lang="ts">
    import ErrorComponent from "$lib/components/alert/ErrorComponent.svelte";
    import { _ } from "$lib/services/i18n/i18n.service";
    import { chatService } from "$lib/services/chat/chat.service";
    import { chatroom, lastChatroom } from "$lib/stores/user.store";

    export let disabled: boolean = false;

    let joinRoomInput: string = $lastChatroom;
    let roomMaxLength: number = 30;
    let joinPending: boolean = false;
    let showChatroomNotExistingError: boolean = false;

    function onJoinRoomInputKeyDown(event: KeyboardEvent): void {
        if (event.key !== "Enter") return;
        join();
    }

    async function join(): Promise<void> {
        const room: string = joinRoomInput.trim();
        if (room.length === 0) return;
        joinPending = true;
        if (!(await chatService.chatroomExists(room))) {
            console.log(`Creating Chatroom '${room}'`);
            await chatService.createChatroom(room);
        }
        if (await chatService.joinChatroom(room)) {
            console.log(`Joining chatroom '${room}'`);
            $chatroom = room;
        }
        joinPending = false;
    }
</script>

<div id="join-chatroom">
    {#if showChatroomNotExistingError}
        <div class="error">
            <ErrorComponent
                text={$_("chatroom.error.not_existing.label")}
            />
        </div>
    {/if}
    <!-- svelte-ignore a11y-autofocus -->
    <input
        bind:value={joinRoomInput}
        on:keydown={onJoinRoomInputKeyDown}
        maxlength={roomMaxLength}
        disabled={joinPending || disabled}
        type="text"
        id="join-chatroom-input"
        placeholder={$_("chatroom.input.room.placeholder")}
        autocomplete="off"
        autofocus
    />
    <button
        id="join-chatroom-button"
        class="primary"
        on:click={join}
        disabled={joinPending || disabled}
    >
        <span>{$_("chatroom.join.label")}</span>
    </button>
</div>

<style lang="scss">
    #join-chatroom {
        font-family: "Cairo", sans-serif;
        min-width: 300px;
        display: flex;
        flex-direction: column;

        @media (min-width: 600px) {
            width: 450px;
        }
    }

    button {
        flex: 1;
    }
</style>
