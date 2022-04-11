import type { Message } from "../../shared/message/Message";

export class MessageManager {

    // Constructor

    constructor() {

    }

    // Members and Properties

    private _messages: Message[] = [];
    public get messages(): Message[] {
        return [...this._messages];
    }

    // Public Methods

    public addMessage(message: Message): void {
        this._messages.push(message);
    }

    // Private Methods

}