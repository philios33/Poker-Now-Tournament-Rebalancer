import { PlayerMovement } from "./playerMovement";
import { BalancingStats } from "./balancingStats";
import { OptimalResult } from "./optimalResult";

export interface BalancingPlayersResult {
    stats: BalancingStats;
    movements: Array<PlayerMovement>;
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