import { Player } from "./player";

export interface Table {
    id: string;
    players: Array<Player>;
    dealerButtonLastRound: number;

    extraPlayers?: number;
}