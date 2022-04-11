export enum ServerEvent {
    SEND_LOGIN = "S_SEND_LOGIN",
    SEND_LOGOUT = "S_SEND_LOGOUT",

    RESPONSE_MESSAGE_LIST = "S_RESPONSE_MESSAGE_LIST",
    RESPONSE_ONLINE_USERS = "S_RESPONSE_ONLINE_USERS",
    
    SEND_TEXT_MESSAGE = "S_SEND_TEXT_MESSAGE",
    SEND_SYSTEM = "S_SEND_SYSTEM",

    RESPONSE_LOGIN_USERNAME_ACCEPT = "S_RESPONSE_LOGIN_USERNAME_ACCEPT",
    RESPONSE_LOGIN_USERNAME_TAKEN = "S_RESPONSE_LOGIN_USERNAME_TAKEN",

    RESPONSE_CHATROOM_EXISTS = "S_RESPONSE_CHATROOM_EXISTS",
    RESPONSE_CHATROOM_NOT_EXISTS = "S_RESPONSE_CHATROOM_NOT_EXISTS",

    RESPONSE_CREATE_CHATROOM_ACCEPT = "S_RESPONSE_CREATE_CHATROOM_ACCEPT",
    RESPONSE_CREATE_CHATROOM_TAKEN = "S_RESPONSE_CREATE_CHATROOM_TAKEN",
    
    RESPONSE_JOIN_CHATROOM_ACCEPT = "S_RESPONSE_JOIN_CHATROOM_ACCEPT",
    RESPONSE_JOIN_CHATROOM_NOT_EXISTING = "S_RESPONSE_JOIN_CHATROOM_NOT_EXISTING",    
}
