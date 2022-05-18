<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Subscription } from "rxjs";
    import { onDestroy, onMount } from "svelte";
    import { lastUsername, loggedIn, user } from "$lib/stores/user.store";
    import { chatService } from "$lib/services/chat/chat.service";
    import ErrorComponent from "$lib/components/alert/ErrorComponent.svelte";
    import LoadComponent from "$lib/components/alert/LoadComponent.svelte";
    import { _ } from "$lib/services/i18n/i18n.service";

    export let disabled: boolean = false;

    const subscriptions: Subscription[] = [];

    let usernameMaxInputLength: number = 50;
    let usernameInput: string = $lastUsername;
    let showConnectionError: boolean = false;
    let showDuplicateUsernameError: boolean = false;
    let loginPending: boolean = false;
    const loginPendingDelay: number = 100;

    onMount(() => {
        subscriptions.push(
            chatService.onConnectError.subscribe(() => {
                showConnectionError = true;
                $loggedIn = false;
                loginPending = false;
            }),
            chatService.onReconnectError.subscribe(() => {
                showConnectionError = true;
                $loggedIn = false;
                loginPending = false;
            })
        );
    });

    onDestroy(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    });

    async function login(): Promise<void> {
        const username: string = usernameInput.trim();
        if (!username || username.length === 0) return;

        clearErrors();
        let loginDone: boolean = false;
        chatService.connect();
        setTimeout(() => {
            if (!loginDone) {
                loginPending = true;
            }
        }, loginPendingDelay);
        if (await chatService.login(username)) {
            console.log(`Username ${username} accepted!`);
            $user = { name: username };
            $loggedIn = true;
        } else {
            console.log(`Username ${username} rejected!`);
            showDuplicateUsernameError = true;
            $loggedIn = false;
        }
        loginDone = true;
        loginPending = false;
    }

    function clearErrors(): void {
        showConnectionError = false;
        showDuplicateUsernameError = false;
    }

    async function onUsernameInputKeyDown(event: any): Promise<void> {
        if (event.key !== "Enter") return;
        await login();
    }
</script>

<div id="login">
    {#if showConnectionError}
        <div class="error" in:fade>
            <ErrorComponent
                text={$_("connection.error.connection.error.label")}
            />
        </div>
    {/if}
    {#if showDuplicateUsernameError}
        <div class="error" in:fade>
            <ErrorComponent
                text={$_("connection.error.username.taken.label")}
            />
        </div>
    {/if}
    {#if loginPending}
        <div class="loading" in:fade>
            <LoadComponent text={$_("connection.connect.label")} />
        </div>
    {/if}
    <!-- svelte-ignore a11y-autofocus -->
    <input
        bind:value={usernameInput}
        on:keydown={onUsernameInputKeyDown}
        maxlength={usernameMaxInputLength}
        disabled={loginPending || disabled}
        type="text"
        id="login-username"
        placeholder={$_("connection.input.username.label")}
        autocomplete="off"
        autofocus
    />
    <button
        id="login-button"
        class="primary"
        on:click={login}
        disabled={loginPending || disabled}
    >
        <span>{$_("connection.connect.label")}</span>
    </button>
</div>

<style lang="scss">
    #login {
        font-family: "Cairo", sans-serif;
        min-width: 300px;
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
