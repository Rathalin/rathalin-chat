<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Subscription } from "rxjs";
    import { lastUsername, loggedIn, user } from "../../../stores/user.store";
    import { onDestroy, onMount } from "svelte";
    import { chatService } from "../../../services/chat/chat.service";
    import LoginErrorComponent from "./LoginErrorComponent.svelte";
    import LoginLoadComponent from "./LoginLoadComponent.svelte";
    import { translate } from "../../../services/i18n/i18n.service";
    import { SocketEvent } from "../../../shared/SocketEvent";
    import type { UsernameAcceptMessage } from "../../../shared/messages/login/UsernameAcceptMessage";
    import type { UsernameTakenMessage } from "../../../shared/messages/login/UsernameTakenMessage";
    import { MessageType } from "../../../shared/MessageType";

    const subscriptions: Subscription[] = [];

    let usernameMaxInputLength: number = 50;
    let usernameInput: string = $lastUsername;
    let showConnectionError: boolean = false;
    let showDuplicateUsernameError: boolean = false;
    let loginPending: boolean = false;

    onMount(() => {
        subscriptions.push(
            chatService.onError.subscribe((error) => {
                showConnectionError = true;
                $loggedIn = false;
                loginPending = false;
            }),
            chatService.onLoginUsernameAccept.subscribe(
                (acceptMessage: UsernameAcceptMessage) => {
                    const { username } = acceptMessage;
                    console.log(`Username ${username} accepted!`);
                    $user = { username };
                    $lastUsername = username;
                    $loggedIn = true;
                    loginPending = false;
                }
            ),
            chatService.onLoginUsernameTaken.subscribe(
                (takenMessage: UsernameTakenMessage) => {
                    const { username } = takenMessage;
                    console.log(`Username ${username} rejected!`);
                    showDuplicateUsernameError = true;
                    $loggedIn = false;
                    loginPending = false;
                }
            )
        );
    });

    onDestroy(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    });

    function login(): void {
        const username: string = usernameInput.trim();
        if (!username || username.length === 0) return;

        clearErrors();
        chatService.connect();
        chatService.login({
            event: SocketEvent.CLIENT_REQUESTS_LOGIN,
            type: MessageType.LOGIN,
            username,
            date: new Date(),
        });
        loginPending = true;
    }

    function clearErrors(): void {
        showConnectionError = false;
        showDuplicateUsernameError = false;
    }

    function onUsernameInputKeyDown(event: any): void {
        if (event.key !== "Enter") return;
        login();
    }
</script>

<div id="login">
    {#if showConnectionError}
        <div class="error" in:fade>
            <LoginErrorComponent
                text={$translate("connection.error.connection.error.label")}
            />
        </div>
    {/if}
    {#if showDuplicateUsernameError}
        <div class="error" in:fade>
            <LoginErrorComponent
                text={$translate("connection.error.username.taken.label")}
            />
        </div>
    {/if}
    {#if loginPending}
        <div class="loading" in:fade>
            <LoginLoadComponent text={$translate("connection.connect.label")} />
        </div>
    {/if}
    <!-- svelte-ignore a11y-autofocus -->
    <input
        bind:value={usernameInput}
        on:keydown={onUsernameInputKeyDown}
        maxlength={usernameMaxInputLength}
        disabled={loginPending}
        type="text"
        id="login-username"
        placeholder={$translate("connection.input.username.label")}
        autocomplete="off"
        autofocus
    />
    <div>
        <button id="login-button" on:click={login} disabled={loginPending}>
            <span>{$translate("connection.enter.label")}</span>
        </button>
    </div>
</div>

<style lang="scss">
    #login {
        font-family: "Cairo", sans-serif;
        min-width: 300px;
        margin: auto;
        display: flex;
        flex-direction: column;
        

        @media (min-width: 600px) {
            width: 450px;
        }
    }

    div {
        display: flex;
    }

    .error {
        flex: 1;
    }

    input {
        background-color: var(--primary-light);
        border: none;
        color: white;
        padding: 0.8em 0.8em;
        margin-bottom: 1em;
        border: transparent solid 1px;

        &:focus-visible {
            outline: none;
            border: var(--secondary-dark) solid 1px;
        }

        &::placeholder {
            color: rgb(187, 187, 187);
        }
    }

    #login-button {
        flex: 1;
        text-transform: uppercase;
        background-color: var(--secondary-light);
        padding: 0.8em;
        border: none;
        display: flex;
        justify-content: center;

        &:hover {
            &:not([disabled]) {
                background-color: var(--secondary-dark);
                cursor: pointer;
                color: white;
            }
        }

        &:disabled {
            color: var(--primary);
            opacity: 0.5;
        }
    }
</style>
