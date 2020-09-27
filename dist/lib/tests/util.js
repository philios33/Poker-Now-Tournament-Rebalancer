"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
test('Combine', function () {
    var result = util_1.combine([1, 2, 3], 0);
    expect(result).toStrictEqual([
        [1],
        [2],
        [3],
        [1, 2],
        [1, 3],
        [2, 3],
        [1, 2, 3],
    ]);
});
test('Combine with min', function () {
    var result = util_1.combine([1, 2, 3], 2);
    expect(result).toStrictEqual([
        [1, 2],
        [1, 3],
        [2, 3],
        [1, 2, 3]
    ]);
});
test('Combine with longer array', function () {
    var result = util_1.combine([1, 2, 3, 4, 5, 6], 5);
    expect(result).toStrictEqual([
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 6],
        [1, 2, 3, 5, 6],
        [1, 2, 4, 5, 6],
        [1, 3, 4, 5, 6],
        [2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6],
    ]);
});
test('Get Table Combinations', function () {
    var tableA = {
        id: 'A',
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: []
    };
    var tableB = {
        id: 'B',
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: []
    };
    var tableC = {
        id: 'C',
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: []
    };
    var choose1 = util_1.getTableCombinations([tableA, tableB, tableC], 1);
    expect(choose1).toStrictEqual([
        [tableA],
        [tableB],
        [tableC]
    ]);
    var choose2 = util_1.getTableCombinations([tableA, tableB, tableC], 2);
    expect(choose2).toStrictEqual([
        [tableA, tableB],
        [tableA, tableC],
        [tableB, tableC]
    ]);
    var choose3 = util_1.getTableCombinations([tableA, tableB, tableC], 3);
    expect(choose3).toStrictEqual([
        [tableA, tableB, tableC],
    ]);
});
test('invertSeatList', function () {
    expect(util_1.invertSeatList([1, 5, 7], 10)).toStrictEqual([2, 3, 4, 6, 8, 9, 10]);
    expect(util_1.invertSeatList([1, 2, 3], 4)).toStrictEqual([4]);
    expect(util_1.invertSeatList([8, 4, 3, 2, 1], 10)).toStrictEqual([5, 6, 7, 9, 10]);
    expect(util_1.invertSeatList([8, 4, 3, 2, 1, 5, 6, 7, 9, 10], 10)).toStrictEqual([]);
    expect(util_1.invertSeatList([], 10)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
test('findTableById and findPlayerBySeat', function () {
    var P1 = {
        id: "P1",
        movements: 0,
        name: "P1",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 1,
    };
    var P2 = {
        id: "P2",
        movements: 0,
        name: "P2",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 2,
    };
    var P3 = {
        id: "P3",
        movements: 0,
        name: "P3",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 3,
    };
    var P4 = {
        id: "P4",
        movements: 0,
        name: "P4",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 4,
    };
    var tableA = {
        id: "A",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [P1, P2]
    };
    var tableB = {
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [P3, P4]
    };
    var state = {
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB]
    };
    expect(util_1.findTableById(state, "A")).toStrictEqual(tableA);
    expect(util_1.findTableById(state, "B")).toStrictEqual(tableB);
    expect(function () { return util_1.findTableById(state, "C"); }).toThrowError("Table not found with id:C");
    expect(util_1.findPlayerBySeat(tableA, 2)).toStrictEqual(P2);
    expect(util_1.findPlayerBySeat(tableA, 1)).toStrictEqual(P1);
    expect(util_1.findPlayerBySeat(tableB, 3)).toStrictEqual(P3);
    expect(util_1.findPlayerBySeat(tableB, 4)).toStrictEqual(P4);
    expect(function () { return util_1.findPlayerBySeat(tableB, 5); }).toThrowError("Player not found at seat:5 of table B");
    expect(function () { return util_1.findPlayerBySeat(tableA, 15); }).toThrowError("Player not found at seat:15 of table A");
    var sm1 = {
        fromSeatPosition: {
            tableId: "B",
            seatId: 3,
            movements: 0,
            position: "SB",
            numOfPlayers: 4,
        },
        movementScore: 5,
        targetSeat: {
            tableId: "A",
            seat: 3,
            position: "BB",
            numOfPlayers: 3,
        }
    };
    expect(util_1.convertSeatMovementToPlayerMovement(state, sm1)).toStrictEqual({
        fromTable: tableB,
        fromPlayer: P3,
        to: {
            tableId: "A",
            seat: 3,
            position: "BB",
            numOfPlayers: 3,
        },
        movementScore: 5,
    });
});
test('multiplyArrays', function () {
    // Basic cross multiplication
    expect(util_1.multiplyArrays([
        [1],
        [2]
    ], [
        [3],
        [4]
    ])).toStrictEqual([
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
    ]);
    expect(util_1.multiplyArrays([
        [1]
    ], [
        [3]
    ])).toStrictEqual([
        [1, 3],
    ]);
    expect(util_1.multiplyArrays([
        [1, 2],
        [2, 3],
        [1, 3]
    ], [
        [4, 5],
        [5, 6],
        [4, 6],
    ])).toStrictEqual([
        [1, 2, 4, 5],
        [1, 2, 5, 6],
        [1, 2, 4, 6],
        [2, 3, 4, 5],
        [2, 3, 5, 6],
        [2, 3, 4, 6],
        [1, 3, 4, 5],
        [1, 3, 5, 6],
        [1, 3, 4, 6],
    ]);
    expect(util_1.multiplyArrays([
    // Empty
    ], [
        [4, 5],
        [5, 6],
        [4, 6],
    ])).toStrictEqual([
        [4, 5],
        [5, 6],
        [4, 6],
    ]);
    expect(util_1.multiplyArrays([
        [1, 2],
        [2, 3],
        [1, 3]
    ], [
        [4, 5, 6],
    ])).toStrictEqual([
        [1, 2, 4, 5, 6],
        [2, 3, 4, 5, 6],
        [1, 3, 4, 5, 6],
    ]);
    expect(util_1.multiplyArrays([
        [1, 2],
        [2, 3],
        [1, 3]
    ], [
    // Empty
    ])).toStrictEqual([
        [1, 2],
        [2, 3],
        [1, 3]
    ]);
    expect(util_1.multiplyArrays([[1], [2], [3]], [[4], [5]], false)).toStrictEqual([
        [[1], [4]],
        [[1], [5]],
        [[2], [4]],
        [[2], [5]],
        [[3], [4]],
        [[3], [5]],
    ]);
    expect(util_1.multiplyArrays([[1, 2], [2], [3]], [[4], [5]], true)).toStrictEqual([
        [1, 2, 4],
        [1, 2, 5],
        [2, 4],
        [2, 5],
        [3, 4],
        [3, 5],
    ]);
});
test("Work out target seat positions 1", function () {
    var table = {
        id: "3",
        players: [
            {
                id: "6",
                name: "P6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            },
            {
                id: "7",
                name: "P7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            },
            {
                id: "8",
                name: "P8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }
        ],
        dealerButtonLastRound: 5,
        hasStartedNextRound: false,
    };
    var result = util_1.workOutTargetSeatPositions(table, [2]);
    expect(result[0].seat).toBe(2);
    expect(result[0].position).toBe("BB");
});
test("Work out target seat positions 2", function () {
    var table = {
        id: "3",
        players: [
            {
                id: "6",
                name: "P6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            },
            {
                id: "7",
                name: "P7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            },
            {
                id: "8",
                name: "P8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }
        ],
        dealerButtonLastRound: 5,
        hasStartedNextRound: false,
    };
    var result = util_1.workOutTargetSeatPositions(table, [6]);
    expect(result[0].seat).toBe(6);
    expect(result[0].position).toBe("D");
});
test("Work out target seat positions 1 with round already started", function () {
    var table = {
        id: "3",
        players: [
            {
                id: "6",
                name: "P6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            },
            {
                id: "7",
                name: "P7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            },
            {
                id: "8",
                name: "P8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }
        ],
        dealerButtonLastRound: 5,
        hasStartedNextRound: true,
    };
    var result = util_1.workOutTargetSeatPositions(table, [2]);
    expect(result[0].seat).toBe(2);
    expect(result[0].position).toBe("SB");
});
test("Work out target seat positions 2 with round already started", function () {
    var table = {
        id: "3",
        players: [
            {
                id: "6",
                name: "P6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            },
            {
                id: "7",
                name: "P7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            },
            {
                id: "8",
                name: "P8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }
        ],
        dealerButtonLastRound: 5,
        hasStartedNextRound: true,
    };
    var result = util_1.workOutTargetSeatPositions(table, [6]);
    expect(result[0].seat).toBe(6);
    expect(result[0].position).toBe("UTG");
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
    var result = util_1.workOutTargetSeatPositions(tableA, [4, 5]);
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
    var result2 = util_1.workOutTargetSeatPositions(tableB, [2, 6]);
    // Seats should be ordered by position, so SB first
    expect(result2[0].seat).toBe(6);
    expect(result2[0].position).toBe("SB");
    expect(result2[1].seat).toBe(2);
    expect(result2[1].position).toBe("UTG");
});
test("randomlyChooseTables", function () {
    var result = util_1.randomlyChooseTables(['A', 'B', 'C'], 1);
    expect(result.length).toBe(1);
    expect(['A', 'B', 'C'].indexOf(result[0])).toBeGreaterThanOrEqual(0);
    expect(['A', 'B', 'C'].indexOf(result[0])).toBeLessThan(3);
});
test("randomlyChooseTables 2", function () {
    var result = util_1.randomlyChooseTables(['A', 'B', 'C'], 2);
    expect(result.length).toBe(2);
});
test("randomlyChooseTables 3", function () {
    var result = util_1.randomlyChooseTables(['A', 'B', 'C'], 3);
    expect(result.length).toBe(3);
});
//# sourceMappingURL=util.js.map