<script lang="ts">
    import { getRandomInt } from "../../../util/random";

    import { translate } from "../../../services/i18n/i18n.service";
    import type { LoginMessage } from "../../../shared/messages/LoginMessage";

    export let loginMessage: LoginMessage;
    const messageTranslateKey: string = `messages.login_message_${getRandomInt(1, 10)}`;

    $: timestamp = loginMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li class="connect-message">
    <blockquote>
        <span class="text">
            {$translate(messageTranslateKey, {
                values: { username: loginMessage.user.username },
            })}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
    </blockquote>
</li>

<style lang="scss">
    @import "./messages.scss";
</style>
