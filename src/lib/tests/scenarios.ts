import { getRebalancingPlayerMovements } from "../balancer";
import { createTableOf } from "../util";

jest.retryTimes(0);

test('2 full tables, no movements necessary', () => {
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            createTableOf("A", "1", 10, false),
            createTableOf("B", "11", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
    expect(result.optimalResult).toBe(null);
})


test('5 tables of 9, no movements necessary', () => {
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            createTableOf("A", "1", 9, false),
            createTableOf("B", "11", 9, false),
            createTableOf("C", "21", 9, false),
            createTableOf("D", "31", 9, false),
            createTableOf("E", "41", 9, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
    expect(result.optimalResult).toBe(null);
})



test('Case where Table A has 10, and Table B has 8', () => {
    // Should move the best person from table A to B
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            createTableOf("A", "1", 10, false),
            createTableOf("B", "11", 8, false),
        ]
    });
    // Only Seat 9 and Seat 10 are available and they would both be the HJ position in a 9 seated table with D moving to seat 2
    // So the player that is CO (seat 10) from table A should be moved
    expect(result.movements[0].fromTable.id).toBe("A");
    expect(result.movements[0].fromPlayer.name).toBe("TAS10");
    expect(result.movements[0].fromPlayer.position).toBe("CO");
    expect(result.movements[0].fromPlayer.seat).toBe(10);
    expect(result.movements[0].to.tableId).toBe("B");
    expect([9,10].indexOf(result.movements[0].to.seat)).toBeGreaterThan(-1);
    expect(result.movements[0].to.position).toBe("HJ");
    expect(result.movements[0].to.numOfPlayers).toBe(9);
    
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.stats.numberOfPlayersNextRound).toBe(18);
    expect(result.totalScore).toBe(0); // It was a perfect movement

});

test('Flexible case where Table A has 10, and Table B has 8, should do nothing', () => {
    // Should move the best person from table A to B
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 1,
            balanceMinFlexibility: 1,
        },
        tables: [
            createTableOf("A", "1", 10, false),
            createTableOf("B", "11", 8, false),
        ]
    });
    // Optimal seat number is 9, but flexibility should allow 8 or 10
    
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.stats.numberOfPlayersNextRound).toBe(18);
    expect(result.movements.length).toBe(0);
    expect(result.optimalResult).toBe(null);
});


test('Case where Table A has 4, and Table B has 6', () => {
    // Should move all 4 players from Table A to Table B
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            createTableOf("A", "1", 4, false),
            createTableOf("B", "5", 6, false),
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



test('Case where 4 tables have 8, and 2 tables have 9, and 4 tables have 10', () => {
    // Total Players 90
    // Should break 1 of the tables with 8 players on it
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            createTableOf("A", "1", 8, false),
            createTableOf("B", "11", 8, false),
            createTableOf("C", "21", 8, false),
            createTableOf("D", "31", 8, false),
            createTableOf("E", "41", 9, false),
            createTableOf("F", "51", 9, false),
            createTableOf("G", "61", 10, false),
            createTableOf("H", "71", 10, false),
            createTableOf("I", "81", 10, false),
            createTableOf("J", "91", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(["A"]);
    expect(result.movements.length).toBe(8);
    // console.log(result.processedCombinations + " of " + result.totalCombinations);
});


test('Case where 8 tables have 8, and 1 table has 9, and 1 table has 10', () => {
    // 83 Players in total
    // But there are 8 choices of table to break
    // For each one, try moving every combination of those players in the many available seats left.
    // Since there are also 7 empty seats left with 9 tables, there are a lot of combinations. (56M)
    // We expect this to breach the 5 second mark
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            createTableOf("A", "1", 8, false),
            createTableOf("B", "11", 8, false),
            createTableOf("C", "21", 8, false),
            createTableOf("D", "31", 8, false),
            createTableOf("E", "41", 8, false),
            createTableOf("F", "51", 8, false),
            createTableOf("G", "61", 8, false),
            createTableOf("H", "71", 8, false),
            createTableOf("I", "81", 9, false),
            createTableOf("J", "91", 10, false),
        ]
    });
    expect(result.stats.currentNumberOfTables).toBe(10);
    expect(result.stats.numberOfPlayersNextRound).toBe(83);
    expect(result.stats.optimalNumberOfTables).toBe(9);
    expect(result.stats.tableIdsBeingBrokenUp.length).toBe(1);
    expect(result.totalScore).toBeGreaterThan(50);
    // These things are not deterministic
    // expect(result.optimalResult.totalCombinations).toBe(576);
    // expect(result.msTaken).toBeGreaterThan(1000);
});

test('Case where 1 table has 5, and 6 other tables are full', () => {
    // Total Players 65
    // Should not break any tables, but should move 4 players (1 from each of 4 of the full tables) to table A, 
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [
            createTableOf("A", "1", 5, false),
            createTableOf("B", "11", 10, false),
            createTableOf("C", "21", 10, false),
            createTableOf("D", "31", 10, false),
            createTableOf("E", "41", 10, false),
            createTableOf("F", "51", 10, false),
            createTableOf("G", "61", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(4);

    // console.log(result.optimalResult.processedCombinations + " of " + result.optimalResult.totalCombinations);
    // console.log("MOVEMENTS", JSON.stringify(result.movements, null, 4));
});

test('High flexibility scenario 1', () => {
    // Total Players 55
    // Should not make any movements yet
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 4, // 0 = Balance anything under 9, 1 = Balance anything under 8, 2 = Balance anything under 7, 3 = Balance anything under 6, 4 = Balance anything under 5
        },
        tables: [
            createTableOf("A", "1", 10, false),  
            createTableOf("B", "11", 10, false),
            createTableOf("C", "21", 5, false), // So leave this one until it does down to 4 (see next test)
            createTableOf("D", "31", 10, false),
            createTableOf("E", "41", 10, false),
            createTableOf("F", "51", 10, false),
            createTableOf("G", "61", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(0);
});

test('High flexibility scenario 2', () => {
    // Total Players 64
    // Now fully balance table C
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 4, // 0 = Balance anything under 9, 1 = Balance anything under 8, 2 = Balance anything under 7, 3 = Balance anything under 6, 4 = Balance anything under 5
        },
        tables: [
            createTableOf("A", "1", 10, false),  
            createTableOf("B", "11", 10, false),
            createTableOf("C", "21", 4, false),  // Fully balance this one now up to the optimal 9 players.  So take 5 players from the 6 other tables.
            createTableOf("D", "31", 10, false),
            createTableOf("E", "41", 10, false),
            createTableOf("F", "51", 10, false),
            createTableOf("G", "61", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(5);
});

test('High flexibility scenario 3', () => {
    // Total Players 54
    // Now fully balance table C
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 4, // 0 = Balance anything under 9, 1 = Balance anything under 8, 2 = Balance anything under 7, 3 = Balance anything under 6, 4 = Balance anything under 5
        },
        tables: [
            createTableOf("A", "1", 10, false),  
            createTableOf("B", "11", 10, false),
            createTableOf("C", "21", 4, false),  // Fully balance this one now up to the optimal 9 players.  So take 5 players from the 5 other tables.
            createTableOf("D", "31", 10, false),
            createTableOf("E", "41", 10, false),
            createTableOf("F", "51", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual([]);
    expect(result.movements.length).toBe(5);
});

test('High flexibility scenario 4', () => {
    // Total Players 46
    // But break up table C if possible before doing any rebalancing
    const result = getRebalancingPlayerMovements({
        config: {
            maxPlayersPerTable: 10,
            breakWithLessThan: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 4,
        },
        tables: [
            createTableOf("A", "1", 9, false),  
            createTableOf("B", "11", 9, false),
            createTableOf("C", "21", 4, false),
            createTableOf("D", "31", 7, false),
            createTableOf("E", "41", 7, false),
            createTableOf("F", "51", 10, false),
        ]
    });
    expect(result.stats.tableIdsBeingBrokenUp).toStrictEqual(["C"]);
    expect(result.movements.length).toBe(4);
});

