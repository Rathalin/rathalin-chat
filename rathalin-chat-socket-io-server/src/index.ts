import { config } from 'dotenv';
import { ChatServer } from './chatserver/ChatServer';
import type { ServerConfig } from './chatserver/interface/ServerConfig';
import { Logger } from './logger';

function loadServerConfig(): ServerConfig {

    const logger: Logger = new Logger("main");

    const errors: string[] = [];

    logger.log("Parsing .env");

    const socketIoPort: number = parseInt(process.env.SOCKET_IO_PORT || '');
    if (isNaN(socketIoPort)) {
        errors.push('Invalid SOCKET_IO_PORT in .env');
    };

    const { CORS_PORT } = process.env;
    let corsPort: number | "*";
    if (CORS_PORT === "*") {
        corsPort = CORS_PORT;
    } else {
        corsPort = parseInt(process.env.CORS_PORT || '');
        if (isNaN(corsPort)) {
            errors.push('Invalid CORS_PORT in .env');
        };
    }


    if (errors.length > 0) {
        let errorMessages: string = "";
        errors.forEach(err => errorMessages += err + "\n");
        throw new Error(errorMessages);
    }

    return { socketIoPort, corsPort, };
}

(function main(): void {
    config();
    const { socketIoPort, corsPort } = loadServerConfig();
    const chatServer: ChatServer = new ChatServer();
    chatServer.listen(socketIoPort, corsPort);
})();
