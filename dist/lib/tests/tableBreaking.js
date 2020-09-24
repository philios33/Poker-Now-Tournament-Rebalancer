"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balancer_1 = require("../balancer");
var util_1 = require("../util");
test('Dont break tables if more than 5, and no balancing to do', function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 5,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 6, false),
            util_1.createTableOf("B", "11", 7, false),
            util_1.createTableOf("C", "21", 7, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
    expect(result.optimalResult).toBe(null);
});
test('Allow the table break if more than 6', function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 6,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 6, false),
            util_1.createTableOf("B", "11", 7, false),
            util_1.createTableOf("C", "21", 7, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(["A"]);
    expect(result.movements.length).toBe(6);
});
test('Dont break tables if more than 4, and no balancing to do', function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 4,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 5, false),
            util_1.createTableOf("B", "11", 5, false),
            util_1.createTableOf("C", "21", 6, false),
            util_1.createTableOf("D", "31", 6, false),
            util_1.createTableOf("E", "41", 6, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
    expect(result.optimalResult).toBe(null);
});
test('Allow table breaking of 2 tables', function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 7,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 5, false),
            util_1.createTableOf("B", "11", 5, false),
            util_1.createTableOf("C", "21", 6, false),
            util_1.createTableOf("D", "31", 6, false),
            util_1.createTableOf("E", "41", 6, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(['A', 'B']);
    expect(result.movements.length).toBe(10);
});
test('Dont break tables but rebalance', function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 4,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 5, false),
            util_1.createTableOf("B", "11", 5, false),
            util_1.createTableOf("C", "21", 6, false),
            util_1.createTableOf("D", "31", 6, false),
            util_1.createTableOf("E", "41", 7, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(1);
});
test('Dont break tables and dont rebalance because of max flexibility allows 1 extra player than the optimal', function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 4,
            balanceMaxFlexibility: 1,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 5, false),
            util_1.createTableOf("B", "11", 5, false),
            util_1.createTableOf("C", "21", 6, false),
            util_1.createTableOf("D", "31", 6, false),
            util_1.createTableOf("E", "41", 7, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
});
test('Dont break up tables if the max is 6 anyway', function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 6,
            preventTableBreakingIfMoreThan: 7,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 5, false),
            util_1.createTableOf("B", "11", 5, false),
            util_1.createTableOf("C", "21", 6, false),
            util_1.createTableOf("D", "31", 6, false),
            util_1.createTableOf("E", "41", 6, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
});
test("Table break and rebalance at the same time", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 2, false),
            util_1.createTableOf("B", "11", 6, false),
            util_1.createTableOf("C", "21", 10, false),
            util_1.createTableOf("D", "31", 10, false),
            util_1.createTableOf("E", "41", 10, false),
            util_1.createTableOf("F", "51", 10, false),
            util_1.createTableOf("G", "61", 10, false),
            util_1.createTableOf("H", "71", 10, false),
            util_1.createTableOf("I", "81", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(['A']);
    // 2 Movements from A to B would make the total on B 8
    // so need to pull 1 extra player from another table since we have strict balancing
    expect(result.movements.length).toBe(3);
});
test("Table break and skip rebalance at the same time", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 1,
        },
        tables: [
            util_1.createTableOf("A", "1", 2, false),
            util_1.createTableOf("B", "11", 6, false),
            util_1.createTableOf("C", "21", 10, false),
            util_1.createTableOf("D", "31", 10, false),
            util_1.createTableOf("E", "41", 10, false),
            util_1.createTableOf("F", "51", 10, false),
            util_1.createTableOf("G", "61", 10, false),
            util_1.createTableOf("H", "71", 10, false),
            util_1.createTableOf("I", "81", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(['A']);
    // 2 Movements from A to B would make the total on B 8
    // so we don't need to pull over 1 extra player from another table since we don't have strict balancing
    expect(result.movements.length).toBe(2);
});
test("Just rebalance", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 8, false),
            util_1.createTableOf("B", "11", 8, false),
            util_1.createTableOf("C", "21", 10, false),
            util_1.createTableOf("D", "31", 10, false),
            util_1.createTableOf("E", "41", 10, false),
            util_1.createTableOf("F", "51", 10, false),
            util_1.createTableOf("G", "61", 10, false),
            util_1.createTableOf("H", "71", 10, false),
            util_1.createTableOf("I", "81", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(2);
});
test("Just skip rebalance", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 1,
        },
        tables: [
            util_1.createTableOf("A", "1", 8, false),
            util_1.createTableOf("B", "11", 8, false),
            util_1.createTableOf("C", "21", 10, false),
            util_1.createTableOf("D", "31", 10, false),
            util_1.createTableOf("E", "41", 10, false),
            util_1.createTableOf("F", "51", 10, false),
            util_1.createTableOf("G", "61", 10, false),
            util_1.createTableOf("H", "71", 10, false),
            util_1.createTableOf("I", "81", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
});
test("Just rebalance", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 5, false),
            util_1.createTableOf("B", "11", 10, false),
            util_1.createTableOf("C", "21", 10, false),
            util_1.createTableOf("D", "31", 10, false),
            util_1.createTableOf("E", "41", 10, false),
            util_1.createTableOf("F", "51", 10, false),
            util_1.createTableOf("G", "61", 10, false),
            util_1.createTableOf("H", "71", 10, false),
            util_1.createTableOf("I", "81", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(4);
});
test("Break table A", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 5, false),
            util_1.createTableOf("B", "11", 7, false),
            util_1.createTableOf("C", "21", 8, false),
            util_1.createTableOf("D", "31", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(['A']);
    expect(result.movements.length).toBe(5);
});
test("Rebalance 2 from D to A", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 6, false),
            util_1.createTableOf("B", "11", 7, false),
            util_1.createTableOf("C", "21", 8, false),
            util_1.createTableOf("D", "31", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    // Move 2 from D to A
    expect(result.movements.length).toBe(2);
});
test("Rebalance 3 between all tables", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 6, false),
            util_1.createTableOf("B", "11", 6, false),
            util_1.createTableOf("C", "21", 9, false),
            util_1.createTableOf("D", "31", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    // Move 3: 1 from C, 2 from D -> First 1 goes on A, then 1 on B, and the last on either A or B
    expect(result.movements.length).toBe(3);
});
test("Test 2 tables breaking up", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 2, false),
            util_1.createTableOf("B", "11", 7, false),
            util_1.createTableOf("C", "21", 6, false),
            util_1.createTableOf("D", "31", 2, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(['A', 'D']);
    expect(result.movements.length).toBe(4);
});
test("Test 3 tables breaking up", function () {
    var result = balancer_1.getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            preventTableBreakingIfMoreThan: 9,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            util_1.createTableOf("A", "1", 2, false),
            util_1.createTableOf("B", "11", 7, false),
            util_1.createTableOf("C", "21", 6, false),
            util_1.createTableOf("D", "31", 2, false),
            util_1.createTableOf("E", "31", 1, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(['A', 'D', 'E']);
    expect(result.movements.length).toBe(5);
});
//# sourceMappingURL=tableBreaking.js.map