<script lang="ts">
    import type { Subscription } from "rxjs";
    import { lastUsername, user } from "../../stores/user.store";

    import { onDestroy, onMount } from "svelte";
    import { chatService } from "../../services/chat/chat.service";
    import AuthErrorComponent from "./AuthErrorComponent.svelte";
    import { translate } from "../../services/i18n/i18n.service";

    const subscriptions: Subscription[] = [];

    let usernameInputEl: HTMLInputElement;
    let usernameInput: string = $lastUsername;
    let showConnectionError: boolean = false;

    onMount(() => {
        subscriptions.push(
            chatService.onError.subscribe((error) => {
                showConnectionError = true;
            })
        );
    });

    onDestroy(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
    });

    function login(): void {
        const username: string = usernameInput?.trim();
        if (!username || username.length === 0) return;

        $user = { username };
        $lastUsername = username;
        chatService.connect();
        chatService.login({ user: { username }, date: new Date() });
    }

    function onUsernameInputKeyDown(event): void {
        if (event.key !== "Enter") return;
        login();
    }
</script>

<div id="login">
    {#if showConnectionError}
        <div class="login-error">
            <AuthErrorComponent
                text={$translate("connection.connection_error_message")}
            />
        </div>
    {/if}
    <!-- svelte-ignore a11y-autofocus -->
    <input
        bind:this={usernameInputEl}
        bind:value={usernameInput}
        on:keydown={onUsernameInputKeyDown}
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
