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

    type MessageType =
        | "TEXT"
        | "SYSTEM_INFO"
        | "SYSTEM_WARNING"
        | "SYSTEM_ERROR"
        | "LOGIN"
        | "LOGOUT";

    interface MessageWithType {
        type: MessageType;
        message: any; // Type should be Message
    }

    const subscriptions: Subscription[] = [];
    let lastWindowHeight: number;
    let messageListEl: HTMLUListElement;

    let myUsername: string = $user?.username;
    let messages: MessageWithType[] = [];

    onMount(() => {
        subscriptions.push(
            chatService.onLogin.subscribe(
                (loginMessage: LoginMessage): void => {
                    addMessageToChat({ type: "LOGIN", message: loginMessage });
                    console.log(
                        "User " + loginMessage.user.username + " logged in"
                    );
                }
            ),
            chatService.onLogout.subscribe((logoutMessage: LogoutMessage) => {
                addMessageToChat({ type: "LOGOUT", message: logoutMessage });
                console.log(
                    "User " + logoutMessage.user.username + " logged out"
                );
            }),
            chatService.onTextMessage.subscribe(
                (textMessage: TextMessage): void => {
                    addMessageToChat({ type: "TEXT", message: textMessage });
                }
            ),
            chatService.onSystemInfo.subscribe(
                (systemInfoMessage: SystemInfoMessage): void => {
                    addMessageToChat({
                        type: "SYSTEM_INFO",
                        message: systemInfoMessage,
                    });
                }
            ),
            chatService.onSystemWarning.subscribe(
                (systemWarningMessage: SystemWarningMessage): void => {
                    addMessageToChat({
                        type: "SYSTEM_WARNING",
                        message: systemWarningMessage,
                    });
                }
            ),
            chatService.onSystemError.subscribe(
                (systemErrorMessage: SystemErrorMessage): void => {
                    addMessageToChat({
                        type: "SYSTEM_ERROR",
                        message: systemErrorMessage,
                    });
                }
            )
        );
    });

    onDestroy(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    });

    function addMessageToChat(message: MessageWithType): void {
        messages = [...messages, message];
    }

    async function sendTextMessage(event): Promise<void> {
        const textMessage: TextMessage = event.detail;
        chatService.sendTextMessage(textMessage);
        addMessageToChat({ type: "TEXT", message: textMessage });
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
        {#if message.type === "TEXT"}
            <TextMessageComponent
                isMyMessage={message.message.sender.username === myUsername}
                textMessage={message.message}
            />
        {:else if message.type === "SYSTEM_INFO"}
            <SystemInfoMessageComponent infoMessage={message.message} />
        {:else if message.type === "SYSTEM_WARNING"}
            <SystemWarningMessageComponent warningMessage={message.message} />
        {:else if message.type === "SYSTEM_ERROR"}
            <SystemErrorMessageComponent errorMessage={message.message} />
        {:else if message.type === "LOGIN"}
            <LoginMessageComponent loginMessage={message.message} />
        {:else if message.type === "LOGOUT"}
            <LogoutMessageComponent logoutMessage={message.message} />
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
