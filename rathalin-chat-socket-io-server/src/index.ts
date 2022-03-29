import { config } from 'dotenv';
import { Server } from 'socket.io';
import { ChatServer } from './chatserver';
import { IServerConfig } from './interfaces/IServerConfig';
import { loadServerConfig } from './loadConfig';

(function main(): void {
    config();
    
    const serverConfig: IServerConfig | null = loadServerConfig();
    if (!serverConfig) {
        console.error("Could not load server config!");
        return;
    }
    const chatServer: ChatServer = new ChatServer(serverConfig);
    chatServer.listen();

})();
