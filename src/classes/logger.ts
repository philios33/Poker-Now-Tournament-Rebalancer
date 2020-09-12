
interface LogEntry {
    occurred: Date;
    message: string;
}

export class Logger {
    entries: Array<LogEntry>;
    lastEntry: LogEntry;
    enabled: boolean;

    constructor(enabled: boolean, message: string) {
        this.entries = [];
        this.lastEntry = null;
        this.enabled = enabled;

        this.log(message);
    }

    log(message: string) {
        if (this.enabled) {
            const entry = {
                occurred: new Date,
                message,
            };

            this.entries.push(entry);

            let diff = 0;
            if (this.lastEntry !== null) {
                diff = entry.occurred.getTime() - this.lastEntry.occurred.getTime();
            }
            
            console.log(entry.occurred, entry.message, diff + " ms");
            
            this.lastEntry = entry;
        }
    }
}