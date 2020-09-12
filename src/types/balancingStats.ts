export interface BalancingStats {
    numberOfPlayersNextRound: number;
    optimalNumberOfTables: number;
    currentNumberOfTables: number;
    maxNumberOfPlayersOnTables: number;
    tableIdsBeingBrokenUp: Array<string>;
}
