import { SeatPosition } from "./seatPosition";
import { TargetSeat } from "./targetSeat";

export interface SeatMovement {
    fromSeatPosition: SeatPosition;
    targetSeat: TargetSeat;
    movementScore: number;
}