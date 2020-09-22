import { Table } from "../types/table";
import { TournamentState } from "../types/tournamentState";
import { SeatMovement } from "../types/seatMovement";
import { PlayerMovement } from "../types/playerMovement";

export const getTableCombinations = (tables: Array<Table>, choose: number) => {
    return combine(tables, choose).filter(p => p.length === choose);
}
export const getTableIdCombinations = (tableIds: Array<string>, choose: number) => {
    return combine(tableIds, choose).filter(p => p.length === choose);
}

export const combine = function(a, min) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}

export const invertSeatList = (seatIdList: Array<number>, pokerNowMaxSeatId: number) => {
    const negatedList = [];
    for(let i=1; i<=pokerNowMaxSeatId; i++) {
        if (seatIdList.indexOf(i) === -1) {
            negatedList.push(i);
        }
    }
    return negatedList;
}

export const findTableById = (state: TournamentState, tableId: string): Table => {
    for(const table of state.tables) {
        if (table.id === tableId) {
            return table;
        }
    }
    throw new Error("Table not found with id:" + tableId);
}

export const findPlayerBySeat = (table: Table, seatId: number) => {
    for(const player of table.players) {
        if (player.seat === seatId) {
            return player;
        }
    }
    throw new Error("Player not found at seat:" + seatId + " of table " + table.id);
}

export const convertSeatMovementToPlayerMovement = (state: TournamentState, sm: SeatMovement): PlayerMovement => {
    const table = findTableById(state, sm.fromSeatPosition.tableId);
    const player = findPlayerBySeat(table, sm.fromSeatPosition.seatId);

    return {
        fromTable: table,
        fromPlayer: player,
        to: sm.targetSeat,
        movementScore: sm.movementScore,
    }
}

export const multiplyArrays = (array1, array2, considerAsArrays = true) => {
    if (array1.length === 0) {
        return array2;
    } else {
        if (array2.length === 0) {
            return array1;
        }

        // For every item of array2, push it against every item of array 1
        let result = [];
        for (let array1Item of array1) {
            for (let array2Item of array2) {
                if (considerAsArrays) {
                    result.push([...array1Item, ...array2Item]);
                } else {
                    result.push([array1Item, array2Item]);
                }
            }
        }
        return result;
    }
}

export const randomlyChooseTables = (tableListId: Array<string>, choose: number) => {
    if (choose > tableListId.length) {
        throw new Error("ERROR: The number of tables is " + tableListId.length + " but we are choosing " + choose + " random");
    }
    tableListId.sort(() => Math.random() - 0.5);
    return tableListId.slice(0, choose);
}

export const getSeatListOfActivePlayers = (tableId: string, state: TournamentState) => {
    let table = findTableById(state, tableId);
    return table.players.filter(p => p.participatingNextRound).map(p => p.seat);
}