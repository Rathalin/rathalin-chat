<script lang="ts">
    import { translate } from "../../../services/i18n/i18n.service";
    import type { LoginMessage } from "../../../shared/messages/LoginMessage";

    export let loginMessage: LoginMessage;

    $: timestamp = loginMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li class="connect-message">
    <blockquote>
        <span class="text">
            {$translate("messages.login_message", {
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
