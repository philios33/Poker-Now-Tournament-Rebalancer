import { PlayerMovement } from "./playerMovement";
import { BalancingStats } from "./balancingStats";

export interface BalancingPlayersResult {
    stats: BalancingStats;
    movements: Array<PlayerMovement>;
    totalScore: number;
    totalCombinations: number;
    processedCombinations: number;
    totalMovementsChecked: number;
    totalMovementsSkipped: number;
    msTaken: number;
}