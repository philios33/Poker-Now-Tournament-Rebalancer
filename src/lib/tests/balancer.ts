import { getNumberOfPlayersNextRound, getTableSizeAndMovementsScore, getTablesWithLeastSizeAndMovements, getTablesWithLowestSize, getRebalancingMovements, getRebalancingPlayerMovements } from "../balancer";
import { TournamentState } from "../../types/tournamentState";
import { Table } from "../../types/table";
import { FinalTableDetectedError } from "../../classes/finalTableDetectedError";
import { NoActiveTablesError } from "../../classes/noActiveTableError";

test("getNumberOfPlayersNextRound", () => {
    const emptyTournament: TournamentState = {
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: []
    }
    expect(getNumberOfPlayersNextRound(emptyTournament)).toBe(0);

    const headsUpTournament: TournamentState = {
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [{
            id: "A",
            dealerButtonLastRound: 1,
            hasStartedNextRound: false,
            players: [
                {
                    id: "1",
                    name: "1",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 1,
                },
                {
                    id: "2",
                    name: "2",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 2,
                },
                {
                    id: "3",
                    name: "3",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: false, // Busted player
                    seat: 3,
                }
            ]
        }]
    }
    expect(getNumberOfPlayersNextRound(headsUpTournament)).toBe(2);

    const multiTableTournament: TournamentState = {
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [{
            id: "A",
            dealerButtonLastRound: 1,
            hasStartedNextRound: false,
            players: [
                {
                    id: "1",
                    name: "1",
                    movements: 0,
                    participatingLastRound: false,
                    participatingNextRound: true,
                    seat: 1,
                },
                {
                    id: "2",
                    name: "2",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 2,
                },
                {
                    id: "3",
                    name: "3",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: false,
                    seat: 3,
                }
            ]
        }, {
            id: "B",
            dealerButtonLastRound: 1,
            hasStartedNextRound: false,
            players: [
                {
                    id: "4",
                    name: "4",
                    movements: 0,
                    participatingLastRound: false,
                    participatingNextRound: true,
                    seat: 4,
                },
                {
                    id: "5",
                    name: "5",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "6",
                    name: "6",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: false,
                    seat: 6,
                }
            ]
        }]
    }
    expect(getNumberOfPlayersNextRound(multiTableTournament)).toBe(4);
});

test("getTableSizeAndMovementsScore and getTablesWithLeastSizeAndMovements and getTablesWithLowestSize", () => {
    // A Table with more players should have a higher score

    const tableA = {
        id: "A",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "1",
            name: "1",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        }, {
            id: "2",
            name: "2",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        }]
    }
    const tableAScore = getTableSizeAndMovementsScore(tableA);

    const tableB = {
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "3",
            name: "3",
            movements: 1, // Even though they have had a movement already
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        }]
    }
    const tableBScore = getTableSizeAndMovementsScore(tableB);

    expect(tableAScore).toBeGreaterThan(tableBScore);

    // A Table with more player movements should have a higher score
    const tableC = {
        id: "C",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "4",
            name: "4",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        }, {
            id: "5",
            name: "5",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        }, {
            id: "6",
            name: "6",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 3,
        }]
    }
    const tableCScore = getTableSizeAndMovementsScore(tableC);

    const tableD = {
        id: "D",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "7",
            name: "7",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        }, {
            id: "8",
            name: "8",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        }, {
            id: "9",
            name: "9",
            movements: 1,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 3,
        }]
    }
    const tableDScore = getTableSizeAndMovementsScore(tableD);

    expect(tableCScore).toBeLessThan(tableDScore);

    // A Table with a huge number of movements should have a higher score than a table with 1 more person
    const tableE = {
        id: "E",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "10",
            name: "10",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        }, {
            id: "11",
            name: "11",
            movements: 100,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        }]
    }
    const tableEScore = getTableSizeAndMovementsScore(tableE);

    expect(tableCScore).toBeLessThan(tableEScore);

    // getTablesWithLeastSizeAndMovements

    const result = getTablesWithLeastSizeAndMovements([tableA, tableB, tableC, tableD, tableE], 1);
    expect(result).toStrictEqual([tableB]);

    const result2 = getTablesWithLeastSizeAndMovements([tableD, tableE, tableB, tableA, tableC], 1);
    expect(result2).toStrictEqual([tableB]);

    const result3 = getTablesWithLeastSizeAndMovements([tableA, tableB, tableC, tableD, tableE], 3);
    expect(result3).toStrictEqual([tableB, tableA, tableC]);

    expect(getTablesWithLowestSize([tableA, tableB, tableC, tableD, tableE])).toStrictEqual([tableB]);
    expect(getTablesWithLowestSize([tableA, tableC, tableD, tableE])).toStrictEqual([tableA, tableE]);
});

// This is the quick run, players from/to which tables should be moved
test("getRebalancingMovements", () => {
    // Table movements
    const result = getRebalancingMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [{
            id: "A",
            dealerButtonLastRound: 1,
            hasStartedNextRound: false,
            players: [
                {
                    id: "1",
                    name: "1",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 1,
                },
                {
                    id: "2",
                    name: "2",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 2,
                },
                {
                    id: "3",
                    name: "3",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 3,
                }
            ]
        }, {
            id: "B",
            dealerButtonLastRound: 1,
            hasStartedNextRound: false,
            players: [
                {
                    id: "4",
                    name: "4",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 1,
                },
                {
                    id: "5",
                    name: "5",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 2,
                }
            ]
        }],
    });
    expect(result.fromSeats.selections).toStrictEqual({
        "B": {
            tableId: "B",
            seatIdList: [1,2],
            chooseNumber: 2,
        }
    });
    expect(result.targetSeats[0].selections).toStrictEqual({
        "A": {
            tableId: "A",
            seatIdList: [4,5,6,7,8,9,10],
            chooseNumber: 2,
        }
    });
    expect(result.movements).toBe(2);
    expect(result.stats.currentNumberOfTables).toBe(2);
    expect(result.stats.maxNumberOfPlayersOnTables).toBe(5);
    expect(result.stats.numberOfPlayersNextRound).toBe(5);
    expect(result.stats.optimalNumberOfTables).toBe(1);
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(["B"]);
});


// This is the primary function

test("getRebalancingPlayerMovements", () => {
    const tableA: Table = {
        id: "A",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "1",
            name: "1",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        },{
            id: "2",
            name: "2",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        },{
            id: "3",
            name: "3",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 3,
        },{
            id: "4",
            name: "4",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 4,
        }]
    };
    const tableB: Table = {
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "5",
            name: "5",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        },{
            id: "6",
            name: "6",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        },{
            id: "7",
            name: "7",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 3,
        },{
            id: "8",
            name: "8",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 4,
        }]
    };
    const tableC: Table = {
        id: "C",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "9",
            name: "9",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        },{
            id: "10",
            name: "10",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        },{
            id: "11",
            name: "11",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 3,
        },{
            id: "12",
            name: "12",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 4,
        }]
    };
    const state: TournamentState = {
        config: {
            maxPlayersPerTable: 6,
            breakWithLessThan: 6,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB, tableC]
    }
    const result = getRebalancingPlayerMovements(state);

    // Should choose table C to get rid of, and split the 3 players over the other 2 tables
    expect(result.movements.length).toBe(3);
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(["C"]);
    expect(result.stats.currentNumberOfTables).toBe(3);
    expect(result.stats.optimalNumberOfTables).toBe(2);
    expect(result.stats.numberOfPlayersNextRound).toBe(11);
    expect(result.stats.maxNumberOfPlayersOnTables).toBe(6);
    
    
    // console.log(JSON.stringify(result.movements, null, 4));
    // console.log("Checked", result.totalMovementsChecked);
    // console.log("Skipped", result.totalMovementsSkipped);
    
});


test("Check zero movements when only 1 active table", () => {
    const tableA: Table = {
        id: "A",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "1",
            name: "1",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        },{
            id: "2",
            name: "2",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 2,
        },{
            id: "3",
            name: "3",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 3,
        },{
            id: "4",
            name: "4",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 4,
        }]
    };
    const tableB: Table = {
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "5",
            name: "5",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 1,
        },{
            id: "6",
            name: "6",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 2,
        },{
            id: "7",
            name: "7",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 3,
        },{
            id: "8",
            name: "8",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 4,
        }]
    };
    
    const state: TournamentState = {
        config: {
            maxPlayersPerTable: 6,
            breakWithLessThan: 6,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB]
    }
    
    // Should throw final table error
    expect(() => {
        const result = getRebalancingPlayerMovements(state);
    }).toThrowError(FinalTableDetectedError);    
});


test("Detects zero active tables", () => {
    const tableA: Table = {
        id: "A",
        dealerButtonLastRound: 3,
        hasStartedNextRound: false,
        players: [{
            id: "1",
            name: "1",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 1,
        },{
            id: "2",
            name: "2",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 2,
        },{
            id: "3",
            name: "3",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 3,
        },{
            id: "4",
            name: "4",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 4,
        }]
    };
    const tableB: Table = {
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
            id: "5",
            name: "5",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 1,
        },{
            id: "6",
            name: "6",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 2,
        },{
            id: "7",
            name: "7",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 3,
        },{
            id: "8",
            name: "8",
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: false,
            seat: 4,
        }]
    };
    
    const state: TournamentState = {
        config: {
            maxPlayersPerTable: 6,
            breakWithLessThan: 6,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB]
    }
    
    // Should throw no tables error
    expect(() => {
        const result = getRebalancingPlayerMovements(state);
    }).toThrowError(NoActiveTablesError);    
});