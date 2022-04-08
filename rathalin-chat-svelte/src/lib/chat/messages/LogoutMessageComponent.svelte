<script lang="ts">
    import {
        messageFadeInPosition,
        messageFadeInDuration,
    } from "../../../stores/config.store";
    import { fly } from "svelte/transition";
    import { getRandomInt } from "../../../util/random";
    import { translate } from "../../../services/i18n/i18n.service";
    import type { LogoutMessage } from "../../../shared/message/logout/LogoutMessage";

    export let logoutMessage: LogoutMessage;
    const messageTranslateKey: string = `messages.logout.${getRandomInt(
        1,
        10
    )}`;

    $: timestamp = logoutMessage.date.toLocaleTimeString("at-AT", {
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
