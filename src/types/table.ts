import { Player } from "./player";

export interface Table {
    id: string;
    players: Array<Player>;
    dealerButtonLastRound: number;
    hasStartedNextRound: boolean; // This will be assumed true for all tables but the one that just finished its hand.

    extraPlayers?: number;
}