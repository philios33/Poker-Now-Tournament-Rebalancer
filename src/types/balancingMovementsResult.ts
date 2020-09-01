import SeatSelections from "../classes/seatSelections";


export interface BalancingMovementsResult {
    movements: number;
    fromSeats: SeatSelections;
    targetSeats: Array<SeatSelections>;
}