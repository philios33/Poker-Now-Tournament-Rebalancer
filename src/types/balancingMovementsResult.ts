import SeatSelections from "../classes/seatSelections";
import { BalancingStats } from "./balancingStats";



export interface BalancingMovementsResult {
    movements: number;
    fromSeats: SeatSelections;
    targetSeats: Array<SeatSelections>;
    stats: BalancingStats;
}