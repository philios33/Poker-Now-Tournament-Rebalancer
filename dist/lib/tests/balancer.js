"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balancer_1 = require("../balancer");
test("getNumberOfPlayersNextRound", function () {
    var emptyTournament = {
        config: {
            maxPlayersPerTable: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: []
    };
    expect(balancer_1.getNumberOfPlayersNextRound(emptyTournament)).toBe(0);
    var headsUpTournament = {
        config: {
            maxPlayersPerTable: 10,
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
                        participatingNextRound: false,
                        seat: 3,
                    }
                ]
            }]
    };
    expect(balancer_1.getNumberOfPlayersNextRound(headsUpTournament)).toBe(2);
    var multiTableTournament = {
        config: {
            maxPlayersPerTable: 10,
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
    };
    expect(balancer_1.getNumberOfPlayersNextRound(multiTableTournament)).toBe(4);
});
test("getTableSizeAndMovementsScore and getTablesWithLeastSizeAndMovements and getTablesWithLowestSize", function () {
    // A Table with more players should have a higher score
    var tableA = {
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
    };
    var tableAScore = balancer_1.getTableSizeAndMovementsScore(tableA);
    var tableB = {
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
                id: "3",
                name: "3",
                movements: 1,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }]
    };
    var tableBScore = balancer_1.getTableSizeAndMovementsScore(tableB);
    expect(tableAScore).toBeGreaterThan(tableBScore);
    // A Table with more player movements should have a higher score
    var tableC = {
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
    };
    var tableCScore = balancer_1.getTableSizeAndMovementsScore(tableC);
    var tableD = {
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
    };
    var tableDScore = balancer_1.getTableSizeAndMovementsScore(tableD);
    expect(tableCScore).toBeLessThan(tableDScore);
    // A Table with a huge number of movements should have a higher score than a table with 1 more person
    var tableE = {
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
    };
    var tableEScore = balancer_1.getTableSizeAndMovementsScore(tableE);
    expect(tableCScore).toBeLessThan(tableEScore);
    // getTablesWithLeastSizeAndMovements
    var result = balancer_1.getTablesWithLeastSizeAndMovements({
        config: {
            maxPlayersPerTable: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB, tableC, tableD, tableE],
    }, 1);
    expect(result).toStrictEqual([tableB]);
    var result2 = balancer_1.getTablesWithLeastSizeAndMovements({
        config: {
            maxPlayersPerTable: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableD, tableE, tableB, tableA, tableC],
    }, 1);
    expect(result2).toStrictEqual([tableB]);
    var result3 = balancer_1.getTablesWithLeastSizeAndMovements({
        config: {
            maxPlayersPerTable: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB, tableC, tableD, tableE],
    }, 3);
    expect(result3).toStrictEqual([tableB, tableA, tableC]);
    expect(balancer_1.getTablesWithLowestSize([tableA, tableB, tableC, tableD, tableE])).toStrictEqual([tableB]);
    expect(balancer_1.getTablesWithLowestSize([tableA, tableC, tableD, tableE])).toStrictEqual([tableA, tableE]);
});
// This is the quick run, players from/to which tables should be moved
test("getRebalancingMovements", function () {
    // Table movements
    var result = balancer_1.getRebalancingMovements({
        config: {
            maxPlayersPerTable: 10,
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
            seatIdList: [1, 2],
            chooseNumber: 2,
        }
    });
    expect(result.targetSeats[0].selections).toStrictEqual({
        "A": {
            tableId: "A",
            seatIdList: [4, 5, 6, 7, 8, 9, 10],
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
test("workOutTargetSeatPositions", function () {
    var tableA = {
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
    };
    var result = balancer_1.workOutTargetSeatPositions(tableA, [4, 5]);
    expect(result[0].seat).toBe(4);
    expect(result[0].position).toBe("BB");
    expect(result[1].seat).toBe(5);
    expect(result[1].position).toBe("UTG");
    var tableB = {
        id: "B",
        dealerButtonLastRound: 2,
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
                participatingNextRound: false,
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
    };
    var result2 = balancer_1.workOutTargetSeatPositions(tableB, [2, 6]);
    // Seats should be ordered by position, so SB first
    expect(result2[0].seat).toBe(6);
    expect(result2[0].position).toBe("SB");
    expect(result2[1].seat).toBe(2);
    expect(result2[1].position).toBe("UTG");
});
// This is the primary function
test("getRebalancingPlayerMovements", function () {
    var tableA = {
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
            }, {
                id: "3",
                name: "3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "4",
                name: "4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }]
    };
    var tableB = {
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
            }, {
                id: "6",
                name: "6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "7",
                name: "7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "8",
                name: "8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }]
    };
    var tableC = {
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
            }, {
                id: "10",
                name: "10",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "11",
                name: "11",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "12",
                name: "12",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: false,
                seat: 4,
            }]
    };
    var state = {
        config: {
            maxPlayersPerTable: 6,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB, tableC]
    };
    var result = balancer_1.getRebalancingPlayerMovements(state);
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
//# sourceMappingURL=balancer.js.map