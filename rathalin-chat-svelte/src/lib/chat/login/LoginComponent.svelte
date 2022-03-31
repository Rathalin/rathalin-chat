<script lang="ts">
    import type { Subscription } from "rxjs";
    import { lastUsername, user } from "../../../stores/user.store";

    import { onDestroy, onMount } from "svelte";
    import { chatService } from "../../../services/chat/chat.service";
    import LoginErrorComponent from "./LoginErrorComponent.svelte";
    import { translate } from "../../../services/i18n/i18n.service";
    import { SocketEventEnum } from "../../../shared/events/SocketEventEnum";
    import type { UsernameAcceptMessage } from "src/shared/messages/UsernameAcceptMessage";
    import type { UsernameTakenMessage } from "src/shared/messages/UsernameTakenMessage";

    const subscriptions: Subscription[] = [];

    let usernameMaxInputLength: number = 20;
    let usernameInput: string = $lastUsername;
    let showConnectionError: boolean = false;
    let showDuplicateUsernameError: boolean = false;
    let loginPending: boolean = false;

    onMount(() => {
        subscriptions.push(
            chatService.onError.subscribe((error) => {
                showConnectionError = true;
                loginPending = false;
            }),
            chatService.onLoginUsernameAccept.subscribe(
                (acceptMessage: UsernameAcceptMessage) => {
                    const { username } = acceptMessage;
                    console.log(`Username ${username} accepted!`);
                    $user = { username };
                    $lastUsername = username;
                    loginPending = false;
                }
            ),
            chatService.onLoginUsernameTaken.subscribe(
                (takenMessage: UsernameTakenMessage) => {
                    const { username } = takenMessage;
                    console.log(`Username ${username} rejected!`);
                    showDuplicateUsernameError = true;
                    loginPending = false;
                }
            ),
        );
    });

    onDestroy(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    });

    function login(): void {
        const username: string = usernameInput.trim();
        if (!username || username.length === 0) return;

        $user = { username };
        $lastUsername = username;

        clearErrors();
        chatService.connect();
        chatService.login({
            type: SocketEventEnum.LOGIN,
            user: { username },
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
        <div class="login-error">
            <LoginErrorComponent
                text={$translate("connection.connection_error_message")}
            />
        </div>
    {/if}
    {#if showDuplicateUsernameError}
        <div class="login-error">
            <LoginErrorComponent
                text={$translate(
                    "connection.login_username_taken_error_message"
                )}
            />
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
        placeholder={$translate("connection.username_input_label")}
        autocomplete="off"
        autofocus
    />
    <div>
        <button id="login-button" on:click={login}
            >{$translate("connection.enter_label")}</button
        >
    </div>
</div>

<style>
    #login {
        margin: auto;
        display: flex;
        flex-direction: column;
        width: 25%;
    }

    div {
        display: flex;
    }

    .login-error {
        flex: 1;
    }

    input {
        background-color: var(--primary-light);
        border: none;
        color: white;
        padding: 0.8em 0.8em;
        margin-bottom: 1em;
        border: transparent solid 1px;
    }

    input:focus-visible {
        outline: none;
        border: var(--secondary-dark) solid 1px;
    }

    input::placeholder {
        color: rgb(187, 187, 187);
    }

    #login-button {
        flex: 1;
        text-transform: uppercase;
        background-color: var(--secondary-light);
        padding: 0.8em;
        border: none;
    }

    #login-button:hover {
        background-color: var(--secondary-dark);
        cursor: pointer;
        color: white;
    }

    @media (max-width: 1000px) {
        #login {
            width: initial;
            margin: auto 1em;
        }
    }
</style>
