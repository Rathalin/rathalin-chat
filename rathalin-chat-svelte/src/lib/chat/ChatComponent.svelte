<script lang="ts">
    import { chatService } from "../../services/chat/chat.service";
    import type { LoginMessage } from "../../shared/messages/LoginMessage";
    import type { LogoutMessage } from "../../shared/messages/LogoutMessage";

    import type { SystemErrorMessage } from "../../shared/messages/SystemErrorMessage";
    import type { SystemInfoMessage } from "../../shared/messages/SystemInfoMessage";
    import type { SystemWarningMessage } from "../../shared/messages/SystemWarningMessage";
    import type { TextMessage } from "../../shared/messages/TextMessage";

    import { user } from "../../stores/user.store";

    import type { Subscription } from "rxjs";
    import TextMessageComponent from "./messages/TextMessageComponent.svelte";
    import SystemInfoMessageComponent from "./messages/SystemInfoMessageComponent.svelte";
    import SystemWarningMessageComponent from "./messages/SystemWarningMessageComponent.svelte";
    import SystemErrorMessageComponent from "./messages/SystemErrorMessageComponent.svelte";
    import LoginMessageComponent from "./messages/LoginMessageComponent.svelte";
    import LogoutMessageComponent from "./messages/LogoutMessageComponent.svelte";
    import ChatInputBarComponent from "./ChatInputBarComponent.svelte";
    import { onDestroy, onMount, tick } from "svelte";
    import { MessageType } from "../../shared/MessageType";
    import type { Message } from "../../shared/messages/Message";

    const subscriptions: Subscription[] = [];
    let lastWindowHeight: number;
    let messageListEl: HTMLUListElement;

    let myUsername: string = $user?.username;
    let messages: Message[] = [];

    onMount(() => {
        subscriptions.push(
            chatService.onLogin.subscribe(
                (loginMessage: LoginMessage): void => {
                    addMessageToChat(loginMessage);
                    console.log("User " + loginMessage.username + " logged in");
                }
            ),
            chatService.onLogout.subscribe((logoutMessage: LogoutMessage) => {
                addMessageToChat(logoutMessage);
                console.log("User " + logoutMessage.username + " logged out");
            }),
            chatService.onTextMessage.subscribe(
                (textMessage: TextMessage): void => {
                    addMessageToChat(textMessage);
                }
            ),
            chatService.onSystemInfo.subscribe(
                (systemInfoMessage: SystemInfoMessage): void => {
                    addMessageToChat(systemInfoMessage);
                }
            ),
            chatService.onSystemWarning.subscribe(
                (systemWarningMessage: SystemWarningMessage): void => {
                    addMessageToChat(systemWarningMessage);
                }
            ),
            chatService.onSystemError.subscribe(
                (systemErrorMessage: SystemErrorMessage): void => {
                    addMessageToChat(systemErrorMessage);
                }
            )
        );
    });

    onDestroy(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    });

    function addMessageToChat(message: Message): void {
        messages = [...messages, message];
    }

    async function sendTextMessage(event): Promise<void> {
        const textMessage: TextMessage = event.detail;
        chatService.sendTextMessage(textMessage);
        addMessageToChat(textMessage);
        await tick();
        scrollToBottom();
    }

    function scrollToBottom(): void {
        messageListEl.scrollTop =
            messageListEl.scrollHeight - messageListEl.clientHeight;
    }

    window.addEventListener("resize", (event: UIEvent): void => {
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
    });
</script>

<ul class="chat-messages" bind:this={messageListEl}>
    {#each messages as message}
        {#if chatService.isTextMessage(message)}
            <TextMessageComponent
                isMyMessage={message.sender === myUsername}
                textMessage={message}
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

<style lang="scss">
    ul.chat-messages {
        padding: 0em 2em;
        margin: 0em 0em 0.2em 0em;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
</style>
