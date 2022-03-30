<script lang="ts">
    import { translate } from "../../../services/i18n/i18n.service";
    import type { LogoutMessage } from "../../../shared/messages/LogoutMessage";
    import type { User } from "../../../shared/user/User";

    export let logoutMessage: LogoutMessage;

    $: timestamp = logoutMessage.date.toLocaleTimeString("at-AT", {
        hour: "2-digit",
        minute: "2-digit",
    });
</script>

<li>
    <blockquote>
        <span class="text">
            {$translate("messages.logout_message", {
                values: { username: logoutMessage.user.username },
            })}
        </span>
        <span class="timestamp">
            {timestamp}
        </span>
    </blockquote>
</li>

<style>
    li {
        list-style: none;
        align-self: center;
    }

    li:first-child {
        margin-top: 30px;
    }

    li:not(:last-child) {
        margin-bottom: 1em;
    }

    li:last-child {
        margin-bottom: 1em;
    }

    blockquote {
        padding: 0.3em 0.8em;
        margin: 0px;
        border-radius: 8px;
        white-space: pre;
        position: relative;
        font-size: 10pt;
        background-color: var(--primary-lighter);
        color: white;
        align-self: center;
    }

    .timestamp {
        font-size: 8pt;
        margin-left: 0.5em;
        color: rgba(255, 255, 255, 0.5);
    }
</style>
