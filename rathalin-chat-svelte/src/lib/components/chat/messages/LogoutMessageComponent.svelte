<script lang="ts">
    import {
        messageFadeInPosition,
        messageFadeInDuration,
    } from "$lib/stores/config.store";
    import { fly } from "svelte/transition";
    import { getRandomInt } from "$lib/util/random";
    import { _ } from "$lib/services/i18n/i18n.service";
    import type { UsernameMessage } from "$lib/shared/message/user/UsernameMessage";

    export let logoutMessage: UsernameMessage;
    const messageTranslateKey: string = `messages.logout.${getRandomInt(
        1,
        10
    )}`;

    $: timestamp = new Date(logoutMessage.date).toLocaleTimeString("at-AT", {
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
            {$_(messageTranslateKey, {
                values: { username: logoutMessage.username },
            })}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
    </blockquote>
</li>

<style lang="scss">
</style>
