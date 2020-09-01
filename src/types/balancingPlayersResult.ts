import { PlayerMovement } from "./playerMovement";

export interface BalancingPlayersResult {
    movements: Array<PlayerMovement>;
    totalScore: number;
}