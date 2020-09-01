import { SeatMovement } from "./seatMovement";

export interface BalancingPlayersSeatResult {
    movements: Array<SeatMovement>;
    totalScore: number;
}