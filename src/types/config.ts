export interface Config {
    maxPlayersPerTable: number;

    // It doesn't make sense to have table breaking flexibility
    breakWithLessThan: number;

    balanceMinFlexibility: number;
    balanceMaxFlexibility: number;
    // It doens't make sense to have balancing threshold

}