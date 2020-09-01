import { Config } from "./config";
import { Table } from "./table";

export interface TournamentState {
    config: Config;
    tables: Array<Table>;
}