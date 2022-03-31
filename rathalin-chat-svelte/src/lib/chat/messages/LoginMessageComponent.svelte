<script lang="ts">
    import { translate } from "../../../services/i18n/i18n.service";
    import type { LoginMessage } from "../../../shared/messages/LoginMessage";

    export let loginMessage: LoginMessage;

    $: timestamp = loginMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li>
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

    li {
        align-self: center;

        blockquote {
            padding: 0.6em 0.8em;
            font-size: 10pt;
            background-color: var(--primary-lighter);
            color: white;

            .timestamp {
                font-size: 8pt;
                margin-left: 0.5em;
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }
</style>
