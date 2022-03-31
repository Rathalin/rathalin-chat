<script lang="ts">
    import { getRandomInt } from "../../../util/random";
    import { translate } from "../../../services/i18n/i18n.service";
    import type { LogoutMessage } from "../../../shared/messages/LogoutMessage";

    export let logoutMessage: LogoutMessage;

    $: timestamp = logoutMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li class="connect-message">
    <blockquote>
        <span class="text">
            {$translate(`messages.logout_message_${getRandomInt(1, 10)}`, {
                values: { username: logoutMessage.user.username },
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
