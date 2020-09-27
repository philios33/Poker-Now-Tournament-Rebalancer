import { Table } from "../types/table";

export class FinalTableDetectedError extends Error {
    finalTable: Table;
    constructor(table: Table) {
        super("Only 1 table is left");
        this.finalTable = table;
        Object.setPrototypeOf(this, FinalTableDetectedError.prototype);
    }
}