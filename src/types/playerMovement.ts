import { TargetSeat } from "./targetSeat";
import { Player } from "./player";
import { Table } from "./table";

export interface PlayerMovement {
    fromTable: Table,
    fromPlayer: Player;
    to: TargetSeat;
    movementScore: number;
}