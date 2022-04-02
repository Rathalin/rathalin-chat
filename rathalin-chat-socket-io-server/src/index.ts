import { config } from 'dotenv';
import { ChatServer } from './ChatServer';
import { loadServerConfig } from './loadConfig';

(function main(): void {
    config();
    const { socketIoPort, corsPort } = loadServerConfig();
    const chatServer: ChatServer = new ChatServer();
    chatServer.listen(socketIoPort, corsPort);
})();
