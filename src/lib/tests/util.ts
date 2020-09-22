import { combine, getTableCombinations, invertSeatList, findTableById, findPlayerBySeat, convertSeatMovementToPlayerMovement, multiplyArrays } from "../util";
import { Table } from "../../types/table";
import { TournamentState } from "../../types/tournamentState";
import { SeatMovement } from "../../types/seatMovement";

test('Combine', () => {
    const result = combine([1,2,3], 0);
    expect(result).toStrictEqual([
        [1],
        [2],
        [3],
        [1,2],
        [1,3],
        [2,3],
        [1,2,3],
    ]);
});

test('Combine with min', () => {
    const result = combine([1,2,3], 2);
    expect(result).toStrictEqual([
        [1,2],
        [1,3],
        [2,3],
        [1,2,3]
    ]);
});

test('Combine with longer array', () => {
    const result = combine([1,2,3,4,5,6], 5);
    expect(result).toStrictEqual([
        [1,2,3,4,5],
        [1,2,3,4,6],
        [1,2,3,5,6],
        [1,2,4,5,6],
        [1,3,4,5,6],
        [2,3,4,5,6],
        [1,2,3,4,5,6],
    ]);
});

test('Get Table Combinations', () => {
    const tableA: Table = {
        id: 'A',
        dealerButtonLastRound:1,
        hasStartedNextRound: false,
        players: []
    };
    const tableB: Table = {
        id: 'B',
        dealerButtonLastRound:1,
        hasStartedNextRound: false,
        players: []
    };
    const tableC: Table = {
        id: 'C',
        dealerButtonLastRound:1,
        hasStartedNextRound: false,
        players: []
    };
    const choose1 = getTableCombinations([tableA, tableB, tableC], 1);
    expect(choose1).toStrictEqual([
        [tableA],
        [tableB],
        [tableC]
    ]);

    const choose2 = getTableCombinations([tableA, tableB, tableC], 2);
    expect(choose2).toStrictEqual([
        [tableA, tableB],
        [tableA, tableC],
        [tableB, tableC]
    ]);

    const choose3 = getTableCombinations([tableA, tableB, tableC], 3);
    expect(choose3).toStrictEqual([
        [tableA, tableB, tableC],
    ]);
})

test('invertSeatList', () => {
    expect(invertSeatList([1,5,7], 10)).toStrictEqual([2,3,4,6,8,9,10]);
    expect(invertSeatList([1,2,3], 4)).toStrictEqual([4]);
    expect(invertSeatList([8,4,3,2,1], 10)).toStrictEqual([5,6,7,9,10]);
    expect(invertSeatList([8,4,3,2,1,5,6,7,9,10], 10)).toStrictEqual([]);
    expect(invertSeatList([], 10)).toStrictEqual([1,2,3,4,5,6,7,8,9,10]);
})

test('findTableById and findPlayerBySeat', () => {

    const P1 = {
        id: "P1",
        movements: 0,
        name: "P1",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 1,
    };
    const P2 = {
        id: "P2",
        movements: 0,
        name: "P2",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 2,
    };
    const P3 = {
        id: "P3",
        movements: 0,
        name: "P3",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 3,
    };
    const P4 = {
        id: "P4",
        movements: 0,
        name: "P4",
        participatingLastRound: true,
        participatingNextRound: true,
        seat: 4,
    };

    const tableA = {
        id: "A",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [P1,P2]
    }
    const tableB = {
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [P3,P4]
    }

    const state: TournamentState = {
        config: {
            maxPlayersPerTable: 10,
            balanceMaxFlexibility: 0,
            balanceMinFlexibility: 0,
        },
        tables: [tableA, tableB]
    }

    expect(findTableById(state, "A")).toStrictEqual(tableA);
    expect(findTableById(state, "B")).toStrictEqual(tableB);
    expect(() => findTableById(state, "C")).toThrowError("Table not found with id:C");

    expect(findPlayerBySeat(tableA, 2)).toStrictEqual(P2);
    expect(findPlayerBySeat(tableA, 1)).toStrictEqual(P1);
    expect(findPlayerBySeat(tableB, 3)).toStrictEqual(P3);
    expect(findPlayerBySeat(tableB, 4)).toStrictEqual(P4);
    expect(() => findPlayerBySeat(tableB, 5)).toThrowError("Player not found at seat:5 of table B");
    expect(() => findPlayerBySeat(tableA, 15)).toThrowError("Player not found at seat:15 of table A");

    const sm1: SeatMovement = {
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
    }
    expect(convertSeatMovementToPlayerMovement(state, sm1)).toStrictEqual({
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
})

test('multiplyArrays', () => {
    // Basic cross multiplication
    expect(multiplyArrays([
        [1],
        [2]
    ], [
        [3],
        [4]
    ])).toStrictEqual([
        [1,3],
        [1,4],
        [2,3],
        [2,4],
    ]);

    expect(multiplyArrays([
        [1]
    ], [
        [3]
    ])).toStrictEqual([
        [1,3],
    ]);

    expect(multiplyArrays([
        [1,2],
        [2,3],
        [1,3]
    ], [
        [4,5],
        [5,6],
        [4,6],
    ])).toStrictEqual([
        [1,2,4,5],
        [1,2,5,6],
        [1,2,4,6],
        [2,3,4,5],
        [2,3,5,6],
        [2,3,4,6],
        [1,3,4,5],
        [1,3,5,6],
        [1,3,4,6],
    ]);

    expect(multiplyArrays([
        // Empty
    ], [
        [4,5],
        [5,6],
        [4,6],
    ])).toStrictEqual([
        [4,5],
        [5,6],
        [4,6],
    ]);

    expect(multiplyArrays([
        [1,2],
        [2,3],
        [1,3]
    ], [
        [4,5,6],
    ])).toStrictEqual([
        [1,2,4,5,6],
        [2,3,4,5,6],
        [1,3,4,5,6],
    ]);

    expect(multiplyArrays([
        [1,2],
        [2,3],
        [1,3]
    ], [
        // Empty
    ])).toStrictEqual([
        [1,2],
        [2,3],
        [1,3]
    ]);
    
    expect(multiplyArrays([[1],[2],[3]],[[4],[5]], false)).toStrictEqual([
        [[1],[4]],
        [[1],[5]],
        [[2],[4]],
        [[2],[5]],
        [[3],[4]],
        [[3],[5]],
    ])
    expect(multiplyArrays([[1,2],[2],[3]],[[4],[5]], true)).toStrictEqual([
        [1,2,4],
        [1,2,5],
        [2,4],
        [2,5],
        [3,4],
        [3,5],
    ])
});
