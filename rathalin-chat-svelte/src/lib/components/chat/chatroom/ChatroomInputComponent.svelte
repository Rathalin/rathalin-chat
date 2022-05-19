<script lang="ts">
    import ErrorComponent from "$lib/components/alert/ErrorComponent.svelte";
    import { _ } from "$lib/services/i18n/i18n.service";
    import { chatService } from "$lib/services/chat/chat.service";
    import { chatroom, lastChatroom } from "$lib/stores/user.store";
    import { goto } from "$app/navigation";
    import Chat from "svelte-material-icons/Chat.svelte";
    import { fade } from "svelte/transition";
    import LoadComponent from "$lib/components/alert/LoadComponent.svelte";

    export let disabled: boolean = false;

    let joinRoomInput: string = $lastChatroom;
    let roomMaxLength: number = 30;
    let showChatroomNotExistingError: boolean = false;
    let joinPending: boolean = false;
    const joinPendingDelay: number = 100;

    function onJoinRoomInputKeyDown(event: KeyboardEvent): void {
        if (event.key !== "Enter") return;
        join();
    }

    async function join(): Promise<void> {
        const room: string = joinRoomInput.trim();
        if (room.length === 0) return;
        let joinDone: boolean = false;
        setTimeout(() => {
            if (!joinDone) {
                joinPending = true;
            }
        }, joinPendingDelay);
        if (!(await chatService.chatroomExists(room))) {
            console.log(`Creating Chatroom '${room}'`);
            await chatService.createChatroom(room);
        }
        if (await chatService.joinChatroom(room)) {
            console.log(`Joining chatroom '${room}'`);
            $chatroom = room;
        }
        joinPending = false;
        joinDone = true;
        goto("/chat");
    }
</script>

<div id="join-chatroom">
    {#if showChatroomNotExistingError}
        <div class="row error">
            <ErrorComponent text={$_("chatroom.error.not_existing.label")} />
        </div>
    {/if}
    {#if joinPending}
        <div in:fade>
            <LoadComponent text={$_("chatroom.join.label")} />
        </div>
    {/if}
    <div class="row">
        <label for="join-chatroom-input"
            >{$_("chatroom.input.room.placeholder")}</label
        >
        <!-- svelte-ignore a11y-autofocus -->
        <input
            bind:value={joinRoomInput}
            on:keydown={onJoinRoomInputKeyDown}
            maxlength={roomMaxLength}
            disabled={joinPending || disabled}
            type="text"
            id="join-chatroom-input"
            autocomplete="off"
            autofocus
        />
    </div>
    <div class="row">
        <button
            id="join-chatroom-button"
            class="primary"
            on:click={join}
            disabled={joinPending || disabled}
        >
            <span>{$_("chatroom.join.label")}</span>
            <Chat size="1.3em" />
        </button>
    </div>
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
