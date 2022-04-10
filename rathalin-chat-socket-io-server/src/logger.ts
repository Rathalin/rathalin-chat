export class Logger {
    
    constructor(tag: string | null = null) {
        this.tag = tag != null ? tag.trim().toUpperCase() : null;
    }

    private readonly tag: string | null;

    log(message: string, context?: string): void {
        let output: string = "";
        output += `[${new Date().toLocaleTimeString()}]`;
        if (this.tag != null) {
            output += `[${this.tag}]`;
        }
        if (context != null && context.trim().length > 0) {
            output += `[${context.toUpperCase()}]`;
        }
        output += " ";
        output += message;
        console.log(output);
    }
    
}
