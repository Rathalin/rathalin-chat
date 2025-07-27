import { Manager, Socket } from "socket.io-client";
import { Subject } from "rxjs";
import { socketIoServerConnection } from "$lib/stores/config.store";
import { get } from "svelte/store";
import type { Username } from "$lib/shared/message/user/Username";
import { ServerEvent } from "$lib/shared/ServerEvent";
import { ClientEvent } from "$lib/shared/ClientEvent";
import { MessageType } from "$lib/shared/MessageType";
import type { Message } from "$lib/shared/message/Message";
import type { TextMessage } from "$lib/shared/message/content/TextMessage";
import type { ChatroomMessage } from "$lib/shared/message/room/ChatroomMessage";
import type { UsernameMessage } from "$lib/shared/message/user/UsernameMessage";
import type { SystemMessage } from "$lib/shared/message/system/SystemMessage";
import type { MessageListMessage } from "$lib/shared/message/content/MessageList";
import type { UsernameListMessage } from "$lib/shared/message/user/UsernameList";
import type { ChatroomName } from "$lib/shared/message/room/ChatroomName";

class ChatService {
  // Public subjects

  public readonly onConnect: Subject<void> = new Subject();
  public readonly onConnectError: Subject<Error> = new Subject();
  public readonly onReconnect: Subject<void> = new Subject();
  public readonly onReconnectError: Subject<Error> = new Subject();
  public readonly onDisconnect: Subject<void> = new Subject();
  public readonly onJoinChatroomMessage: Subject<UsernameMessage> =
    new Subject();
  public readonly onLeaveChatroomMessage: Subject<UsernameMessage> =
    new Subject();
  public readonly onTextMessage: Subject<TextMessage> = new Subject();
  public readonly onSystemMessage: Subject<SystemMessage> = new Subject();

  // Construtor

  constructor() {
    const manager = new Manager(get(socketIoServerConnection), {
      autoConnect: false,
      reconnection: false,
    });
    this._socket = manager.socket("/");
    this.initConnections();
  }

  // Members and Properties

  private _socket: Socket;

  // Public methods

  public connect(): void {
    this._socket.connect();
  }

  public disconnect(): void {
    this._socket.disconnect();
  }

  public login(username: Username): Promise<boolean> {
    return new Promise((resolve) => {
      this._socket.on(ServerEvent.RESPONSE_LOGIN_USERNAME_ACCEPT, () => {
        resolve(true);
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_LOGIN_USERNAME_ACCEPT,
        );
      });
      this._socket.on(ServerEvent.RESPONSE_LOGIN_USERNAME_TAKEN, () => {
        resolve(false);
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_LOGIN_USERNAME_TAKEN,
        );
      });
      const loginMessage: UsernameMessage = {
        event: ClientEvent.REQUEST_LOGIN,
        type: MessageType.USERNAME,
        date: new Date().toString(),
        username,
      };
      this._socket.emit(ClientEvent.REQUEST_LOGIN, loginMessage);
    });
  }

  public chatroomExists(room: ChatroomName): Promise<boolean> {
    return new Promise((resolve) => {
      this._socket.on(ServerEvent.RESPONSE_CHATROOM_EXISTS, () => {
        resolve(true);
        this._socket.removeAllListeners(ServerEvent.RESPONSE_CHATROOM_EXISTS);
      });
      this._socket.on(ServerEvent.RESPONSE_CHATROOM_NOT_EXISTS, () => {
        resolve(false);
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_CHATROOM_NOT_EXISTS,
        );
      });
      const chatroomMessage: ChatroomMessage = {
        event: ClientEvent.REQUEST_CHATROOM_EXISTS,
        type: MessageType.CHATROOM_NAME,
        date: new Date().toString(),
        room,
      };
      this._socket.emit(ClientEvent.REQUEST_CHATROOM_EXISTS, chatroomMessage);
    });
  }

  public createChatroom(room: ChatroomName): Promise<boolean> {
    return new Promise((resolve) => {
      this._socket.on(ServerEvent.RESPONSE_CREATE_CHATROOM_ACCEPT, () => {
        resolve(true);
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_CREATE_CHATROOM_ACCEPT,
        );
      });
      this._socket.on(ServerEvent.RESPONSE_CHATROOM_LIMIT_REACHED, () => {
        console.error(
          "CHATROOM LIMIT REACHED!",
          ServerEvent.RESPONSE_CHATROOM_LIMIT_REACHED,
        );
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_CHATROOM_LIMIT_REACHED,
        );
        resolve(false);
      });
      this._socket.on(ServerEvent.RESPONSE_CREATE_CHATROOM_TAKEN, () => {
        resolve(false);
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_CREATE_CHATROOM_TAKEN,
        );
      });
      const chatroomMessage: ChatroomMessage = {
        event: ClientEvent.REQUEST_CREATE_CHATROOM,
        type: MessageType.CHATROOM_NAME,
        date: new Date().toString(),
        room,
      };
      this._socket.emit(ClientEvent.REQUEST_CREATE_CHATROOM, chatroomMessage);
    });
  }

  public joinChatroom(room: ChatroomName): Promise<boolean> {
    return new Promise((resolve) => {
      this._socket.on(ServerEvent.RESPONSE_JOIN_CHATROOM_ACCEPT, () => {
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_JOIN_CHATROOM_ACCEPT,
        );
        resolve(true);
      });
      this._socket.on(ServerEvent.RESPONSE_JOIN_CHATROOM_NOT_EXISTING, () => {
        this._socket.removeAllListeners(
          ServerEvent.RESPONSE_JOIN_CHATROOM_NOT_EXISTING,
        );
        resolve(false);
      });
      const chatroomMessage: ChatroomMessage = {
        event: ClientEvent.REQUEST_JOIN_CHATROOM,
        type: MessageType.CHATROOM_NAME,
        date: new Date().toString(),
        room,
      };
      this._socket.emit(ClientEvent.REQUEST_JOIN_CHATROOM, chatroomMessage);
    });
  }

  public leaveChatroom(room: ChatroomName): Promise<boolean> {
    return new Promise((resolve) => {
      this._socket.on(ServerEvent.RESPONSE_LEAVE_CHATROOM_ACCEPT, () => {
        resolve(true);
      });
      this._socket.on(ServerEvent.RESPONSE_LEAVE_CHATROOM_NOT_JOINED, () => {
        resolve(false);
      });
      const chatroomMessage: ChatroomMessage = {
        event: ClientEvent.REQUEST_LEAVE_CHATROOM,
        type: MessageType.CHATROOM_NAME,
        date: new Date().toString(),
        room,
      };
      this._socket.emit(ClientEvent.REQUEST_LEAVE_CHATROOM, chatroomMessage);
    });
  }

  public requestMessageList(limit?: number): Promise<MessageListMessage> {
    return new Promise((resolve) => {
      this._socket.on(
        ServerEvent.RESPONSE_MESSAGE_LIST,
        (messageListMessage: MessageListMessage) => {
          resolve(messageListMessage);
          this._socket.removeAllListeners(ServerEvent.RESPONSE_MESSAGE_LIST);
        },
      );
      this._socket.emit(ClientEvent.REQUEST_MESSAGE_LIST, limit);
    });
  }

  public requestOnlineUsers(): Promise<UsernameListMessage> {
    return new Promise((resolve) => {
      this._socket.on(
        ServerEvent.RESPONSE_ONLINE_USERS,
        (onlineUsernameListMessage: UsernameListMessage) => {
          resolve(onlineUsernameListMessage);
          this._socket.removeAllListeners(ServerEvent.RESPONSE_ONLINE_USERS);
        },
      );
      this._socket.emit(ClientEvent.REQUEST_ONLINE_USERS);
    });
  }

  public sendTextMessage(
    text: string,
    sender: Username,
    date: Date = new Date(),
  ): TextMessage {
    const textMessage: TextMessage = {
      event: ClientEvent.SEND_TEXT_MESSAGE,
      type: MessageType.TEXT,
      date: date.toString(),
      text,
      sender,
    };
    this._socket.emit(ClientEvent.SEND_TEXT_MESSAGE, textMessage);
    return textMessage;
  }

  public isUsernameMessage(message: Message): message is UsernameMessage {
    return message.type === MessageType.USERNAME;
  }

  public isTextMessage(message: Message): message is TextMessage {
    return message.type === MessageType.TEXT;
  }

  public isSystemMessage(message: Message): message is SystemMessage {
    return message.type === MessageType.SYSTEM;
  }

  // Private Methods

  private initConnections(): void {
    // Connect
    this._socket.on("connect", () => {
      this.onConnect.next();
    });

    // Connect Error
    this._socket.on("connect_error", (error: Error) => {
      this.onConnectError.next(error);
    });

    // Reconnect
    this._socket.on("reconnect", () => {
      this.onReconnect.next();
    });

    // Reconnect Error
    this._socket.on("reconnect_error", (error: Error) => {
      this.onReconnectError.next(error);
    });

    // Disconnect
    this._socket.on("disconnect", () => {
      this.onDisconnect.next();
    });

    // Join Chatroom
    this._socket.on(
      ServerEvent.SEND_JOIN_CHATROOM,
      (usernameMessage: UsernameMessage): void => {
        this.onJoinChatroomMessage.next(usernameMessage);
      },
    );

    // Leave Chatroom
    this._socket.on(
      ServerEvent.SEND_LEAVE_CHATROOM,
      (usernameMessage: UsernameMessage): void => {
        this.onLeaveChatroomMessage.next(usernameMessage);
      },
    );

    // Text Message
    this._socket.on(
      ServerEvent.SEND_TEXT_MESSAGE,
      (textMessage: TextMessage): void => {
        this.onTextMessage.next(textMessage);
      },
    );

    // System
    this._socket.on(
      ServerEvent.SEND_SYSTEM,
      (systemMessage: SystemMessage): void => {
        this.onSystemMessage.next(systemMessage);
      },
    );
  }
}

export const chatService: ChatService = new ChatService();
