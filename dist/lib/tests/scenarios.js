"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balancer_1 = require("../balancer");
jest.retryTimes(0);
var createTableOf = function (tableId, startingIdent, numPlayers) {
    var nextIdent = parseInt(startingIdent, 10);
    var players = [];
    for (var i = 0; i < numPlayers; i++) {
        var player = {
            id: (nextIdent + i).toString(),
            name: "T" + tableId + "S" + (i + 1).toString(),
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: i + 1,
        };
        players.push(player);
    }
    return {
        id: tableId,
        dealerButtonLastRound: 1,
        players: players,
    };
};
test('Table Creator', function () {
    expect(createTableOf("A", "1", 10)).toStrictEqual({
        id: "A",
        dealerButtonLastRound: 1,
        players: [{
                id: "1",
                name: "TAS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "2",
                name: "TAS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "3",
                name: "TAS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "4",
                name: "TAS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }, {
                id: "5",
                name: "TAS5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "6",
                name: "TAS6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 6,
            }, {
                id: "7",
                name: "TAS7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            }, {
                id: "8",
                name: "TAS8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }, {
                id: "9",
                name: "TAS9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }, {
                id: "10",
                name: "TAS10",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 10,
            }]
    });
    expect(createTableOf("B", "11", 8)).toStrictEqual({
        id: "B",
        dealerButtonLastRound: 1,
        players: [{
                id: "11",
                name: "TBS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "12",
                name: "TBS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "13",
                name: "TBS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "14",
                name: "TBS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }, {
                id: "15",
                name: "TBS5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "16",
                name: "TBS6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 6,
            }, {
                id: "17",
                name: "TBS7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            }, {
                id: "18",
                name: "TBS8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }]
    });
    expect(createTableOf("A", "1", 4)).toStrictEqual({
        id: "A",
        dealerButtonLastRound: 1,
        players: [{
                id: "1",
                name: "TAS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "2",
                name: "TAS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "3",
                name: "TAS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "4",
                name: "TAS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }]
    });
    expect(createTableOf("B", "5", 6)).toStrictEqual({
        id: "B",
        dealerButtonLastRound: 1,
        players: [{
                id: "5",
                name: "TBS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "6",
                name: "TBS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "7",
                name: "TBS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "8",
                name: "TBS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }, {
                id: "9",
                name: "TBS5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "10",
                name: "TBS6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 6,
            }]
    });
});
test('Case where Table A has 10, and Table B has 8', function () {
    // Should move the best person from table A to B
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
        },
        tables: [
            createTableOf("A", "1", 10),
            createTableOf("B", "11", 8),
        ]
    });
    // Only Seat 9 and Seat 10 are available and they would both be the HJ position in a 9 seated table with D moving to seat 2
    // So the player that is CO (seat 10) from table A should be moved
    expect(result.movements[0].fromTable.id).toBe("A");
    expect(result.movements[0].fromPlayer.name).toBe("TAS10");
    expect(result.movements[0].fromPlayer.position).toBe("CO");
    expect(result.movements[0].fromPlayer.seat).toBe(10);
    expect(result.movements[0].to.tableId).toBe("B");
    expect([9, 10].indexOf(result.movements[0].to.seat)).toBeGreaterThan(-1);
    expect(result.movements[0].to.position).toBe("HJ");
    expect(result.movements[0].to.numOfPlayers).toBe(9);
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.stats.numberOfPlayersNextRound).toBe(18);
    expect(result.totalScore).toBe(0); // It was a perfect movement
});
test('Case where Table A has 4, and Table B has 6', function () {
    // Should move all 4 players from Table A to Table B
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
        },
        tables: [
            createTableOf("A", "1", 4),
            createTableOf("B", "5", 6),
        ]
    });
    // Only seats 7, 8, 9 & 10 are available which would be UTG+2, UTG+3, UTG+4, HJ
    // So this isn't going to be a low scoring move.
    // All 4 should be moved and table A should be broken up
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(["A"]);
    expect(result.stats.currentNumberOfTables).toBe(2);
    expect(result.stats.optimalNumberOfTables).toBe(1);
    expect(result.movements.length).toBe(4);
    expect(result.totalScore).toBeGreaterThan(20);
});
test('Case where 4 tables have 8, and 2 tables have 9, and 4 tables have 10', function () {
    // Total Players 90
    // Should break 1 of the tables with 8 players on it
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
        },
        tables: [
            createTableOf("A", "1", 8),
            createTableOf("B", "11", 8),
            createTableOf("C", "21", 8),
            createTableOf("D", "31", 8),
            createTableOf("E", "41", 9),
            createTableOf("F", "51", 9),
            createTableOf("G", "61", 10),
            createTableOf("H", "71", 10),
            createTableOf("I", "81", 10),
            createTableOf("J", "91", 10),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(["A"]);
    expect(result.movements.length).toBe(8);
    // console.log(result.processedCombinations + " of " + result.totalCombinations);
});
// Major Speed Issue with this one (takes 5 minutes of processing)
// Issue is before getOptimalPlayerMovements
test('Case where 8 tables have 8, and 1 table has 9, and 1 table has 10', function () {
    // 83 Players in total
    // But there are 8 choices of table to break
    // For each one, try moving every combination of those players in the many available seats left.
    // Since there are also 7 empty seats left with 9 tables, there are a lot of combinations. (56M)
    // We expect this to breach the 5 second mark
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
        },
        tables: [
            createTableOf("A", "1", 8),
            createTableOf("B", "11", 8),
            createTableOf("C", "21", 8),
            createTableOf("D", "31", 8),
            createTableOf("E", "41", 8),
            createTableOf("F", "51", 8),
            createTableOf("G", "61", 8),
            createTableOf("H", "71", 8),
            createTableOf("I", "81", 9),
            createTableOf("J", "91", 10),
        ]
    });
    expect(result.stats.currentNumberOfTables).toBe(10);
    expect(result.stats.numberOfPlayersNextRound).toBe(83);
    expect(result.stats.optimalNumberOfTables).toBe(9);
    expect(result.stats.tableIdsBeingBrokenUp.length).toBe(1);
    expect(result.totalScore).toBeGreaterThan(50);
    expect(result.totalCombinations).toBe(576);
    expect(result.msTaken).toBeGreaterThan(1000);
});
//# sourceMappingURL=scenarios.js.map