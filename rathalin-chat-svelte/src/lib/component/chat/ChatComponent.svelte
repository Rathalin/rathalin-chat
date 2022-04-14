<script lang="ts">
    import TextMessageComponent from "./messages/TextMessageComponent.svelte";
    import LoginMessageComponent from "./messages/LoginMessageComponent.svelte";
    import LogoutMessageComponent from "./messages/LogoutMessageComponent.svelte";
    import ChatInputBarComponent from "./ChatInputBarComponent.svelte";
    import { onDestroy, onMount, tick } from "svelte";
    import type { Subscription } from "rxjs";
    import type { TextMessage } from "$lib/shared/message/content/TextMessage";
    import SystemMessageComponent from "$lib/component/chat/messages/SystemMessageComponent.svelte";
    import { onlineUserNames, user } from "$lib/stores/user.store";
    import type { Message } from "$lib/shared/message/Message";
    import { chatService } from "$lib/services/chat/chat.service";
    import { messageListLimit } from "$lib/stores/config.store";
    import type { Username } from "$lib/shared/message/user/Username";
    import type { MessageListMessage } from "$lib/shared/message/content/MessageList";
    import { ServerEvent } from "$lib/shared/ServerEvent";

    const subscriptions: Subscription[] = [];
    let lastWindowHeight: number = 0;
    let messageListEl: HTMLUListElement;
    let lastTextMessage: TextMessage | null = null;
    let scrollIsAtBottom: boolean = false;

    let myUsername: Username = $user?.name ?? "";
    let messages: Message[] = [];

    onMount(async () => {
        subscriptions.push(
            chatService.onJoinChatroomMessage.subscribe(async (joinMessage) => {
                await addMessageToChat(joinMessage);
                $onlineUserNames = [...$onlineUserNames, joinMessage.username];
                if (joinMessage.username === myUsername) {
                    await scrollToBottom();
                }
            }),
            chatService.onLeaveChatroomMessage.subscribe(
                async (leaveMessage) => {
                    await addMessageToChat(leaveMessage);
                    $onlineUserNames = $onlineUserNames.filter(
                        (username) => username !== leaveMessage.username
                    );
                }
            ),
            chatService.onTextMessage.subscribe(async (textMessage) => {
                await addMessageToChat(textMessage);
                lastTextMessage = textMessage;
            }),
            chatService.onSystemMessage.subscribe(async (systemMessage) => {
                await addMessageToChat(systemMessage);
            })
        );

        const result = await Promise.all([
            chatService.requestMessageList($messageListLimit),
            chatService.requestOnlineUsers(),
        ]);
        messages = [...messages, ...result[0].messages];
        $onlineUserNames = [...result[1].users];
    });

    onDestroy(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    });

    async function addMessageToChat(message: Message): Promise<void> {
        messages = [...messages, message];
        await tick();
        if (scrollIsAtBottom) {
            scrollToBottom();
        }
    }

    async function sendTextMessage(
        event: CustomEvent<TextMessage>
    ): Promise<void> {
        chatService.sendTextMessage(event.detail);
        await addMessageToChat(event.detail);
        await scrollToBottom();
    }

    async function scrollToBottom(): Promise<void> {
        await tick();
        messageListEl.scrollTop =
            messageListEl.scrollHeight - messageListEl.clientHeight;
    }

    function textMessageIsFollowUp(message: TextMessage): boolean {
        const index: number = messages.indexOf(message);
        if (
            index == -1 ||
            messages.length <= 1 ||
            index <= 0 ||
            index >= messages.length
        ) {
            return false;
        }
        const lastMessage: Message = messages[index - 1];
        return (
            chatService.isTextMessage(lastMessage) &&
            chatService.isTextMessage(message) &&
            lastMessage.sender === message.sender
        );
    }

    function onResize(event: UIEvent): void {
        // if (
        //     lastWindowHeight &&
        //     window.outerHeight < 700 &&
        //     lastWindowHeight !== window.innerHeight
        // ) {
        //     const keyboardGotOpened: boolean =
        //         lastWindowHeight > window.innerHeight;
        //     const keyboardOffset: number = keyboardGotOpened ? 250 : 0;
        //     const isAtBottom: boolean =
        //         document.body.scrollHeight - window.scrollY ===
        //         window.innerHeight + keyboardOffset;
        //     if (!(!keyboardGotOpened && isAtBottom)) {
        //         window.scrollBy(0, lastWindowHeight - window.innerHeight);
        //     }
        //     // addMessageToChat({
        //     //     person: { name: "Debug" },
        //     //     timestamp: "",
        //     //     text: `${document.body.scrollHeight} - ${window.scrollY} === ${window.innerHeight} + ${keyboardOffset}`,
        //     // });
        // }
        // lastWindowHeight = window.innerHeight;
    }
</script>

<svelte:window on:resize={onResize} />

<div class="chat-wrapper">
    <ul class="chat-messages" bind:this={messageListEl}>
        {#each messages as message}
            {#if chatService.isTextMessage(message)}
                <TextMessageComponent
                    textMessage={message}
                    isMyMessage={message.sender === myUsername}
                    isFollowUpMessage={textMessageIsFollowUp(message)}
                />
            {:else if chatService.isSystemMessage(message)}
                <SystemMessageComponent systemMessage={message} />
            {:else if chatService.isUsernameMessage(message)}
                {#if message.event === ServerEvent.SEND_JOIN_CHATROOM}
                    <LoginMessageComponent loginMessage={message} />
                {:else if message.event === ServerEvent.SEND_LEAVE_CHATROOM}
                    <LogoutMessageComponent logoutMessage={message} />
                {/if}
            {/if}
        {/each}
    </ul>
    <ChatInputBarComponent on:message={sendTextMessage} />
</div>

<style lang="scss">
    .chat-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
    }

    ul.chat-messages {
        padding: 0em 2em;
        margin: 0em 0em 0.2em 0em;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
</style>
