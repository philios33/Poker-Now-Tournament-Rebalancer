
export interface PokerNowPlayer {
    id: string;
    name: string;
    // stack: number; // No longer required
    movements: number;
    currentTable: string;
    seat: number;
}