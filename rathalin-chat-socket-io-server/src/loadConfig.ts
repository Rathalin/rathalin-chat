import { ServerConfig } from "./ServerConfig";

export function loadServerConfig(): ServerConfig {

    const errors: string[] = [];

    console.log("Parsing .env");

    const port: number = parseInt(process.env.SOCKETIO_PORT || '');
    if (isNaN(port)) {
        errors.push('Invalid SOCKETIO_PORT in .env');
    };

    const { SVELTE_PORT } = process.env;
    let sveltePort: number | "*";
    if (SVELTE_PORT === "*") {
        sveltePort = SVELTE_PORT;
    } else {
        sveltePort = parseInt(process.env.SVELTE_PORT || '');
        if (isNaN(sveltePort)) {
            errors.push('Invalid SVELTE_PORT in .env');
        };
    }


    if (errors.length > 0) {
        let errorMessages: string = "";
        errors.forEach(err => errorMessages += err + "\n");
        throw new Error(errorMessages);
    }

    return {
        socketIoPort: port,
        corsPort: sveltePort,
    };
};
