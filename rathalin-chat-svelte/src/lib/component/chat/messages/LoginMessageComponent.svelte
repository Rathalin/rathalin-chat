<script lang="ts">
    import { translate } from "$lib/services/i18n/i18n.service";
    import { getRandomInt } from "$lib/util/random";
    import {
        messageFadeInPosition,
        messageFadeInDuration,
    } from "$lib/stores/config.store";

    import { fly } from "svelte/transition";
import type { UsernameMessage } from "$lib/shared/message/user/UsernameMessage";

    export let loginMessage: UsernameMessage;
    const messageTranslateKey: string = `messages.login.${getRandomInt(1, 10)}`;

    $: timestamp = new Date(loginMessage.date).toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li
    class="connect-message"
    in:fly={{ x: $messageFadeInPosition, duration: $messageFadeInDuration }}
>
    <blockquote>
        <span class="text">
            {$translate(messageTranslateKey, {
                values: { username: loginMessage.username },
            })}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
    </blockquote>
</li>

<style lang="scss">
</style>
