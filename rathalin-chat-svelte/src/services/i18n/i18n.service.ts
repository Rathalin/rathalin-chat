import {
    dictionary,
    locale as i18n_locale,
    _
} from 'svelte-i18n';

function setupI18n(locale: string = 'en') {
    dictionary.set({
        en: {
            "app": {
                "name": "Rathalin Messenger",
            },
            "connection": {
                "username_input_label": "Username",
                "email_input_label": "Email",
                "password_input_label": "Password",
                "enter_label": "Enter",
                "exit_label": "Exit",
                "login_label": "Log in",
                "logout_label": "Log out",
                "connection_error_message": "Failed to establish a connection to the server.",
                "connection_lost_message": "Connection lost.",
            },
            "messages": {
                "login_message": "{username} joined the chat.",
                "logout_message": "{username} left the chat.",
            },
            "header": {
                "view_on": "View on",
            }
        },
        de: {
            "app": {
                "name": "Rathalin Messenger",
            },
            "connection": {
                "username_input_label": "Name",
                "email_input_label": "E-Mail",
                "password_input_label": "Passwort",
                "enter_label": "Beitreten",
                "exit_label": "Abmelden",
                "login_label": "Anmelden",
                "logout_label": "Abmelden",
                "connection_error_message": "Es konnte keine Verbindung zum Server hergestellt werden.",
                "connection_lost_message": "Verbindung verloren.",
            },
            "messages": {
                "login_message": "{username} ist eingetreten.",
                "logout_message": "{username} ist gegangen.",
            },
            "header": {
                "view_on": "Ansehen auf",
            }
        },
    });
    i18n_locale.set(locale);
}

export {
    _ as translate,
    setupI18n,
    i18n_locale as locale,
};
