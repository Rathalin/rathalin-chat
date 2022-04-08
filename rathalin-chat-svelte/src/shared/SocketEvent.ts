export enum SocketEvent {
    CLIENT_REQUESTS_MESSAGE_LIST = "CLIENT_REQUESTS_MESSAGES",

    CLIENT_REQUESTS_ONLINE_USERS = "CLIENT_REQUESTS_ONLINE_USERS",
    SERVER_RESPONDS_ONLINE_USERS = "SERVER_RESPONDS_ONLINE_USERS",

    CLIENT_SENDS_TEXT_MESSAGE = "CLIENT_SENDS_TEXT_MESSAGE",
    SERVER_SENDS_TEXT_MESSAGE = "SERVER_SENDS_TEXT_MESSAGE",

    CLIENT_REQUESTS_LOGIN = "CLIENT_REQUESTS_LOGIN",
    SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT = "SERVER_RESPONDS_LOGIN_USERNAME_ACCEPT",
    SERVER_RESPONDS_LOGIN_USERNAME_TAKEN = "SERVER_RESPONDS_LOGIN_USERNAME_TAKEN",
    SERVER_SENDS_LOGIN = "SERVER_SENDS_LOGIN",

    SERVER_SENDS_LOGOUT = "SERVER_SENDS_LOGOUT",

    SERVER_SENDS_SYSTEM_INFO = "SERVER_SENDS_SYSTEM_INFO",
    SERVER_SENDS_SYSTEM_WARNING = "SERVER_SENDS_SYSTEM_WARNING",
    SERVER_SENDS_SYSTEM_ERROR = "SERVER_SENDS_SYSTEM_ERROR",

    CLIENT_REQUESTS_NEW_CHATROOM = "CLIENT_REQUESTS_NEW_CHATROOM",
    SERVER_RESPONDS_NEW_CHATROOM_ACCEPT = "SERVER_RESPONDS_NEW_CHATROOM_ACCEPT",
    SERVER_RESPONDS_CHATROOM_TAKEN = "SERVER_RESPONDS_CHATROOM_TAKEN",
    
    CLIENT_REQUESTS_JOIN_CHATROOM = "CLIENT_REQUESTS_JOIN_CHATROOM",
    SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT = "SERVER_RESPONDS_JOIN_CHATROOM_ACCEPT",
    SERVER_RESPONDS_CHATROOM_NOT_EXISTING = "SERVER_RESPONDS_CHATROOM_NOT_EXISTING",
}
