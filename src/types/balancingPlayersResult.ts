import { PlayerMovement } from "./playerMovement";
import { BalancingStats } from "./balancingStats";
import { OptimalResult } from "./optimalResult";

export interface BalancingPlayersResult {
    stats: BalancingStats;
    movements: Array<PlayerMovement>;
    movementsText: string;
    totalScore: number;

    optimalResult: OptimalResult;
    /*
    totalCombinations: number;
    processedCombinations: number;
    totalMovementsChecked: number;
    totalMovementsSkipped: number;
    */

    msTaken: number;
}