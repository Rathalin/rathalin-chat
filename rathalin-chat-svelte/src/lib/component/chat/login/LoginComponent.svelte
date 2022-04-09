<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Subscription } from "rxjs";
    import { onDestroy, onMount } from "svelte";
    import { lastUsername, loggedIn, user } from "$lib/stores/user.store";
    import { chatService } from "$lib/services/chat/chat.service";
    import type { UsernameAcceptMessage } from "$lib/shared/message/login/UsernameAcceptMessage";
    import type { UsernameTakenMessage } from "$lib/shared/message/login/UsernameTakenMessage";
    import { SocketEvent } from "$lib/shared/SocketEvent";
    import { MessageType } from "$lib/shared/MessageType";
    import ErrorComponent from "$lib/component/alert/ErrorComponent.svelte";
    import LoadComponent from "$lib/component/alert/LoadComponent.svelte";
    import { translate } from "$lib/services/i18n/i18n.service";

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
                    const { username: usrname } = acceptMessage;
                    console.log(`Username ${usrname} accepted!`);
                    $user = { name: usrname };
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
            <ErrorComponent
                text={$translate("connection.error.connection.error.label")}
            />
        </div>
    {/if}
    {#if showDuplicateUsernameError}
        <div class="error" in:fade>
            <ErrorComponent
                text={$translate("connection.error.username.taken.label")}
            />
        </div>
    {/if}
    {#if loginPending}
        <div class="loading" in:fade>
            <LoadComponent text={$translate("connection.connect.label")} />
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
    <button
        id="login-button"
        class="primary"
        on:click={login}
        disabled={loginPending}
    >
        <span>{$translate("connection.connect.label")}</span>
    </button>
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

    .error,
    button {
        flex: 1;
    }
</style>
