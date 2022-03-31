import { ChatServer } from "../chatserver";

describe('Connect', () => {

    let server: ChatServer;

    beforeEach(() => {
        server = new ChatServer({ SOCKETIO_PORT: 9456, SVELTE_PORT: 9457 }); 
    });

    it('should add new client to list', () => {
        
    });

});