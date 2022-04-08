<script lang="ts">
    import { chatService } from "../../services/chat/chat.service";
    import type { LoginMessage } from "../../shared/message/login/LoginMessage";
    import type { LogoutMessage } from "../../shared/message/logout/LogoutMessage";
    import type { SystemErrorMessage } from "../../shared/message/system/SystemErrorMessage";
    import type { SystemInfoMessage } from "../../shared/message/system/SystemInfoMessage";
    import type { SystemWarningMessage } from "../../shared/message/system/SystemWarningMessage";
    import type { TextMessage } from "../../shared/message/content/TextMessage";
    import { onlineUserNames, user } from "../../stores/user.store";
    import TextMessageComponent from "./messages/TextMessageComponent.svelte";
    import SystemInfoMessageComponent from "./messages/SystemInfoMessageComponent.svelte";
    import SystemWarningMessageComponent from "./messages/SystemWarningMessageComponent.svelte";
    import SystemErrorMessageComponent from "./messages/SystemErrorMessageComponent.svelte";
    import LoginMessageComponent from "./messages/LoginMessageComponent.svelte";
    import LogoutMessageComponent from "./messages/LogoutMessageComponent.svelte";
    import ChatInputBarComponent from "./ChatInputBarComponent.svelte";
    import { onDestroy, onMount, tick } from "svelte";
    import type { Message } from "../../shared/message/Message";
    import { messageListLimit } from "../../stores/config.store";
    import type { Subscription } from "rxjs";
    import type { OnlineUserList } from "../../shared/message/online-user-list/OnlineUserList";
    import type { Username } from "../../shared/message/Username";

    const subscriptions: Subscription[] = [];
    let lastWindowHeight: number = 0;
    let messageListEl: HTMLUListElement;
    let lastTextMessage: TextMessage | null = null;
    let scrollIsAtBottom: boolean = false;

    let myUsername: Username = $user?.name ?? "";
    let messages: Message[] = [];

    onMount(() => {
        subscriptions.push(
            chatService.onLogin.subscribe(
                async (loginMessage: LoginMessage) => {
                    await addMessageToChat(loginMessage);
                    $onlineUserNames = [
                        ...$onlineUserNames,
                        loginMessage.username,
                    ];
                    if (loginMessage.username === myUsername) {
                        await scrollToBottom();
                    }
                }
            ),
            chatService.onLogout.subscribe(
                async (logoutMessage: LogoutMessage) => {
                    await addMessageToChat(logoutMessage);
                    $onlineUserNames = $onlineUserNames.filter(
                        (username) => username !== logoutMessage.username
                    );
                }
            ),
            chatService.onOnlineUsers.subscribe(
                (onlineUsers: OnlineUserList) => {
                    $onlineUserNames = [...onlineUsers.users];
                }
            ),
            chatService.onTextMessage.subscribe(
                async (textMessage: TextMessage) => {
                    await addMessageToChat(textMessage);
                    lastTextMessage = textMessage;
                }
            ),
            chatService.onSystemInfo.subscribe(
                async (systemInfoMessage: SystemInfoMessage) => {
                    await addMessageToChat(systemInfoMessage);
                }
            ),
            chatService.onSystemWarning.subscribe(
                async (systemWarningMessage: SystemWarningMessage) => {
                    await addMessageToChat(systemWarningMessage);
                }
            ),
            chatService.onSystemError.subscribe(
                async (systemErrorMessage: SystemErrorMessage) => {
                    await addMessageToChat(systemErrorMessage);
                }
            )
        );

        chatService.requestMessageList($messageListLimit);
        chatService.requestOnlineUsers();
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

    async function sendTextMessage(event: any): Promise<void> {
        const textMessage: TextMessage = event.detail;
        chatService.sendTextMessage(textMessage);
        addMessageToChat(textMessage);
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
            {:else if chatService.isSystemInfoMessage(message)}
                <SystemInfoMessageComponent infoMessage={message} />
            {:else if chatService.isSystemWarningMessage(message)}
                <SystemWarningMessageComponent warningMessage={message} />
            {:else if chatService.isSystemErrorMessage(message)}
                <SystemErrorMessageComponent errorMessage={message} />
            {:else if chatService.isLoginMessage(message)}
                <LoginMessageComponent loginMessage={message} />
            {:else if chatService.isLogoutMessage(message)}
                <LogoutMessageComponent logoutMessage={message} />
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
