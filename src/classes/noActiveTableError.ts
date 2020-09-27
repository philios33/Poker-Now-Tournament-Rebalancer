export class NoActiveTablesError extends Error {
    constructor() {
        super("No active tables");
        Object.setPrototypeOf(this, NoActiveTablesError.prototype);
    }
}