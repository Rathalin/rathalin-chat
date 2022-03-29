import { IServerConfig } from "./interfaces/IServerConfig";

function loadServerConfig(): IServerConfig | null {

    const errors: string[] = [];

    console.log("Parsing .env");

    const port: number = parseInt(process.env.SOCKETIO_PORT || '');
    if (isNaN(port)) {
        errors.push('Invalid SOCKETIO_PORT in .evn');
    };

    const sveltePort: number = parseInt(process.env.SVELTE_PORT || '');
    if (isNaN(sveltePort)) {
        errors.push('Invalid SVELTE_PORT in .evn');
    };

    
    if (errors.length > 0) {
        errors.forEach(err => console.error(err));
        return null;
    }

    return {
        SOCKETIO_PORT: port,
        SVELTE_PORT: sveltePort,
    };
};

export { loadServerConfig };
