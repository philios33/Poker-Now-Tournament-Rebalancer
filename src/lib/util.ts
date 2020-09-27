import { Table } from "../types/table";
import { TournamentState } from "../types/tournamentState";
import { SeatMovement } from "../types/seatMovement";
import { PlayerMovement } from "../types/playerMovement";
import { TargetSeat } from "../types/targetSeat";
import { rotateArray, getPositionsForTableSize } from "./positions";
import { Player } from "../types/player";
import { Config } from "../types/config";
import { TournamentStateError } from "../classes/tournamentStateError";

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
    tableListId = arrayShuffle(tableListId);
    // tableListId.sort(() => Math.random() - 0.5);
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

export function doSanityChecksOnStateConfig(config: Config) {
    if (typeof config === "undefined") {
        throw new TournamentStateError("Expecting state key: config");
    }
    if (typeof config !== "object") {
        throw new TournamentStateError("state.config must be an object");
    }
    let expectingNumericKeys = ['maxPlayersPerTable', 'breakWithLessThan', 'balanceMinFlexibility', 'balanceMaxFlexibility'];
    for(const key of expectingNumericKeys) {
        if (!(key in config)) {
            throw new TournamentStateError("state.config object must contain numeric key: " + key);
        }
        if (typeof config[expectingNumericKeys[key]] === "number" && Number.isInteger(config[expectingNumericKeys[key]])) {
            throw new TournamentStateError("state.config." + key + " is not an integer: " + config[expectingNumericKeys[key]]);
        }
    }

    if (config.maxPlayersPerTable > 10) {
        throw new TournamentStateError("state.config.maxPlayersPerTable cannot be more than 10 because PN doesnt support this many players");
    }
    if (config.maxPlayersPerTable < 2) {
        throw new TournamentStateError("state.config.maxPlayersPerTable cannot be less than 2 because tables need at least 2 players to be active");
    }

    if (config.breakWithLessThan < 2) {
        throw new TournamentStateError("state.config.breakWithLessThan must be at least 2 to break up tables with 1 player left");
    }
    if (config.balanceMinFlexibility < 0) {
        throw new TournamentStateError("state.config.balanceMinFlexibility must not be negative");
    }
    if (config.balanceMaxFlexibility < 0) {
        throw new TournamentStateError("state.config.balanceMaxFlexibility must not be negative");
    }

}

export function doSanityChecksOnStateTables(tables: Array<Table>) {
    if (typeof tables === "undefined") {
        throw new TournamentStateError("Expecting state key: tables");
    }
    if (!Array.isArray(tables)) {
        throw new TournamentStateError("Expecting state.tables to be an array");
    }
    const tableIdsObj: {[key:string]: boolean} = {};
    const playerIdsObj: {[key:string]: string} = {};
    for (let i=0; i<tables.length; i++) {
        const table = tables[i];
        
        doSanityChecksOnTableObject(table, i, playerIdsObj);

        if (table.id in tableIdsObj) {
            throw new TournamentStateError("Duplicate table id found in state.tables: " + table.id);
        } else {
            tableIdsObj[table.id] = true;
        }
    }

    if (tables.length === 0) {
        throw new TournamentStateError("Expecting state.tables array to contain at least 1 table object");
    }
}

export function doSanityChecksOnTableObject(table: Table, index: number, playerIdsObj: {[key:string]: string}) {
    // Table must be an object
    if (typeof table !== "object") {
        throw new TournamentStateError("Non object found at index " + index + " of state.tables");
    }

    // Table must have an id of string type
    if (typeof table.id !== "string") {
        throw new TournamentStateError("Table at state.tables[" + index + "] must contain a unique identity string at key: id, but found: " + typeof table.id);
    }
    if (table.id === "") {
        throw new TournamentStateError("state.tables[" + index + "].id must not be empty string");
    }

    doSanityCheckOnSeatNumber(table.dealerButtonLastRound, "state.table[" + index + "].dealerButtonLastRound");

    if (typeof table.hasStartedNextRound !== "boolean") {
        throw new TournamentStateError("Table at state.tables[" + index + "] must contain boolean at key: hasStartedNextRound, but found" + typeof table.hasStartedNextRound);
    }

    // Check all players
    if (!Array.isArray(table.players)) {
        throw new TournamentStateError("Expecting players array at state.tables[" + index + "].players");
    }
    const seatIdsObj: {[key:number]: boolean} = {};
    for(let i=0; i<table.players.length; i++) {
        const player = table.players[i];
        
        doSanityChecksOnPlayerObject(player, i, table, index);

        if (player.id in playerIdsObj) {
            throw new TournamentStateError("Duplicate player id " + player.id + " found at table with id: " + table.id + " previously seen at table with id: " + playerIdsObj[player.id]);
        } else {
            playerIdsObj[player.id] = table.id;
        }

        if (player.seat in seatIdsObj) {
            throw new TournamentStateError("Seat " + player.seat + " on table with id: " + table.id + " has more than 1 player in it");
        } else {
            seatIdsObj[player.seat] = true;
        }
    }
}

export function doSanityChecksOnPlayerObject(player, playerIndex, table, tableIndex) {
    if (typeof player !== "object") {
        throw new TournamentStateError("Non object found at index " + playerIndex + " of state.tables[" + tableIndex + "].players");
    }

    // Player must have an id of string type
    if (typeof player.id !== "string") {
        throw new TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain a unique identity string at key: id, but found: " + typeof player.id);
    }
    if (player.id === "") {
        throw new TournamentStateError("state.tables[" + tableIndex + "].players[" + playerIndex + "].id must not be empty string");
    }

    if (typeof player.name !== "string") {
        throw new TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain a name string at key: name, but found: " + typeof player.name);
    }

    doSanityCheckOnSeatNumber(player.seat, "state.tables[" + tableIndex + "].players[" + playerIndex + "].seat");

    if (typeof player.movements !== "number") {
        throw new TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain the number of movements they have previously made at key: movements, but found: " + typeof player.movements);
    }

    if (typeof player.participatingLastRound !== "boolean") {
        throw new TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain whether the player participated in the previous round at key: participatingLastRound, but found: " + typeof player.participatingLastRound);
    }

    if (typeof player.participatingNextRound !== "boolean") {
        throw new TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain whether the player will participate in the next round at key: participatingNextRound, but found: " + typeof player.participatingNextRound);
    }

}

export function doSanityCheckOnSeatNumber(value, stateRef) {
    if (typeof value !== "number") {
        throw new TournamentStateError("Expected seat position number at " + stateRef + " but found type: " + typeof value);
    }
    if (!Number.isInteger(value)) {
        throw new TournamentStateError("Expected seat position integer (e.g. 1-10) at " + stateRef + " but found value: " + value);
    }
    if (value < 1) {
        throw new TournamentStateError("Seat position cannot be less than 1 at " + stateRef + " but found value: " + value);
    }
    if (value > 10) {
        throw new TournamentStateError("Seat position cannot be more than 10 at " + stateRef + " but found value: " + value);
    }
}

export function arrayShuffle(arr) {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
};