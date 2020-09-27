import { Table } from "../types/table";
import { TournamentState } from "../types/tournamentState";
import { SeatMovement } from "../types/seatMovement";
import { PlayerMovement } from "../types/playerMovement";
import { TargetSeat } from "../types/targetSeat";
import { rotateArray, getPositionsForTableSize } from "./positions";
import { Player } from "../types/player";

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

export const workOutTargetSeatPositions = (table: Table, sc: Array<number>): Array<TargetSeat> => {
    // Given that the following seats would be filled next round, work out the seating positions next round
    // Apply all existing players to seats
    // Note: If the table has already begun it's next round already, we need to go forward 2 hands.

    const players = table.players.filter(p => p.participatingNextRound);
    const existingSeats = players.map(p => p.seat);
    for(let seat of sc) {
        if (existingSeats.indexOf(seat) !== -1) {
            throw new Error("Cannot place a player there, that seat is taken: " + seat);
        }
        players.push({
            name: 'New Player',
            id: 'x',
            participatingLastRound: false,
            participatingNextRound: true,
            seat: seat,
            movements: 0,
        });
    }

    // Sort players array by seat
    players.sort((a,b) => {
        return a.seat - b.seat;
    });

    // Work out where dealer button would be moving to
    let rotateBy = 1;
    for(let i=0; i<players.length; i++) {
        if (players[i].seat < table.dealerButtonLastRound) {
            rotateBy++;
        }
    }
    if (table.hasStartedNextRound) {
        // Move forward 1 extra hand
        rotateBy++;
    }
    rotateArray(players, rotateBy);

    // Get all positions from dealer
    let positions = getPositionsForTableSize(players.length);

    let targetSeats: Array<TargetSeat> = [];
    for(let i=0; i<players.length; i++) {
        const player = players[i];
        if (player.id === "x") {
            targetSeats.push({
                tableId: table.id,
                seat: player.seat,
                position: positions[i],
                numOfPlayers: players.length,
            });
        }
    }
    return targetSeats;
}

export const createTableOf = (tableId: string, startingIdent: string, numPlayers: number, hasStartedNextRound: boolean): Table => {
    let nextIdent = parseInt(startingIdent, 10);
    let players = [];
    for(let i=0; i<numPlayers; i++) {
        let player: Player = {
            id: (nextIdent + i).toString(),
            name: "T" + tableId + "S" + (i+1).toString(),
            movements: 0,
            participatingLastRound: true,
            participatingNextRound: true,
            seat: i+1,
        }
        players.push(player);
    }
    return {
        id: tableId,
        dealerButtonLastRound: 1,
        hasStartedNextRound,
        players: players,
    }
}

export function convertMovementsToText(movements: Array<PlayerMovement>) {
    let txt = "";
    for(let i=0; i<movements.length; i++) {
        const m = movements[i];
        txt += "MOVEMENT " + (i+1) + " / " + movements.length + ": ";
        txt += m.fromPlayer.id + " at table " + m.fromTable.id + " in seat " + m.fromPlayer.seat + " (" + m.fromPlayer.position + ")";
        txt += " --> ";
        txt += " to table " + m.to.tableId + " in seat " + m.to.seat + " (" + m.to.position + ")";
        txt += " score: " + m.movementScore;
        txt += "\n";
    }
    // console.log(txt);
    return txt;
}