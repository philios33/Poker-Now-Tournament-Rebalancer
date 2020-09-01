export interface Player {
    id: string;
    name: string;
    seat: number;
    movements: number;
    participatingLastRound: boolean;
    participatingNextRound: boolean;
    position?: string;
}