
import { BalancingPlayersSeatResult } from "./balancingPlayersSeatResult";

export interface OptimalResult {
    bestResult: BalancingPlayersSeatResult;
    totalCombinations: number;
    processedCombinations: number;
    totalMovementsChecked: number;
    totalMovementsSkipped: number;
    triedAllCombinations: boolean;
}
