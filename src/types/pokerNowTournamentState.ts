import { PokerNowPlayer } from "./pokerNowPlayer";
import { PokerNowTable } from "./pokerNowTable";

export interface PokerNowTournamentState {
    players: {[key: string]: PokerNowPlayer};
    tables: {[key: string]: PokerNowTable};
}