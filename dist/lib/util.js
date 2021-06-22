"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTournamentState = exports.arrayShuffle = exports.doSanityCheckOnSeatNumber = exports.doSanityChecksOnPlayerObject = exports.doSanityChecksOnTableObject = exports.doSanityChecksOnStateTables = exports.doSanityChecksOnStateConfig = exports.convertMovementsToText = exports.createTableOf = exports.workOutTargetSeatPositions = exports.getSeatListOfActivePlayers = exports.randomlyChooseTables = exports.multiplyArrays = exports.convertSeatMovementToPlayerMovement = exports.findPlayerBySeat = exports.findTableById = exports.invertSeatList = exports.combine = exports.getTableIdCombinations = exports.getTableCombinations = void 0;
var positions_1 = require("./positions");
var tournamentStateError_1 = require("../classes/tournamentStateError");
exports.getTableCombinations = function (tables, choose) {
    return exports.combine(tables, choose).filter(function (p) { return p.length === choose; });
};
exports.getTableIdCombinations = function (tableIds, choose) {
    return exports.combine(tableIds, choose).filter(function (p) { return p.length === choose; });
};
exports.combine = function (a, min) {
    var fn = function (n, src, got, all) {
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
    };
    var all = [];
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
};
exports.invertSeatList = function (seatIdList, pokerNowMaxSeatId) {
    var negatedList = [];
    for (var i = 1; i <= pokerNowMaxSeatId; i++) {
        if (seatIdList.indexOf(i) === -1) {
            negatedList.push(i);
        }
    }
    return negatedList;
};
exports.findTableById = function (state, tableId) {
    for (var _i = 0, _a = state.tables; _i < _a.length; _i++) {
        var table = _a[_i];
        if (table.id === tableId) {
            return table;
        }
    }
    throw new Error("Table not found with id:" + tableId);
};
exports.findPlayerBySeat = function (table, seatId) {
    for (var _i = 0, _a = table.players; _i < _a.length; _i++) {
        var player = _a[_i];
        if (player.seat === seatId) {
            return player;
        }
    }
    throw new Error("Player not found at seat:" + seatId + " of table " + table.id);
};
exports.convertSeatMovementToPlayerMovement = function (state, sm) {
    var table = exports.findTableById(state, sm.fromSeatPosition.tableId);
    var player = exports.findPlayerBySeat(table, sm.fromSeatPosition.seatId);
    return {
        fromTable: table,
        fromPlayer: player,
        to: sm.targetSeat,
        movementScore: sm.movementScore,
    };
};
exports.multiplyArrays = function (array1, array2, considerAsArrays) {
    if (considerAsArrays === void 0) { considerAsArrays = true; }
    if (array1.length === 0) {
        return array2;
    }
    else {
        if (array2.length === 0) {
            return array1;
        }
        // For every item of array2, push it against every item of array 1
        var result = [];
        for (var _i = 0, array1_1 = array1; _i < array1_1.length; _i++) {
            var array1Item = array1_1[_i];
            for (var _a = 0, array2_1 = array2; _a < array2_1.length; _a++) {
                var array2Item = array2_1[_a];
                if (considerAsArrays) {
                    result.push(__spreadArrays(array1Item, array2Item));
                }
                else {
                    result.push([array1Item, array2Item]);
                }
            }
        }
        return result;
    }
};
exports.randomlyChooseTables = function (tableListId, choose) {
    if (choose > tableListId.length) {
        throw new Error("ERROR: The number of tables is " + tableListId.length + " but we are choosing " + choose + " random");
    }
    tableListId = arrayShuffle(tableListId);
    // tableListId.sort(() => Math.random() - 0.5);
    return tableListId.slice(0, choose);
};
exports.getSeatListOfActivePlayers = function (tableId, state) {
    var table = exports.findTableById(state, tableId);
    return table.players.filter(function (p) { return p.participatingNextRound; }).map(function (p) { return p.seat; });
};
exports.workOutTargetSeatPositions = function (table, sc) {
    // Given that the following seats would be filled next round, work out the seating positions next round
    // Apply all existing players to seats
    // Note: If the table has already begun it's next round already, we need to go forward 2 hands.
    var players = table.players.filter(function (p) { return p.participatingNextRound; });
    var existingSeats = players.map(function (p) { return p.seat; });
    for (var _i = 0, sc_1 = sc; _i < sc_1.length; _i++) {
        var seat = sc_1[_i];
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
    players.sort(function (a, b) {
        return a.seat - b.seat;
    });
    // Work out where dealer button would be moving to
    var rotateBy = 1;
    for (var i = 0; i < players.length; i++) {
        if (players[i].seat < table.dealerButtonLastRound) {
            rotateBy++;
        }
    }
    if (table.hasStartedNextRound) {
        // Move forward 1 extra hand
        rotateBy++;
    }
    positions_1.rotateArray(players, rotateBy);
    // Get all positions from dealer
    var positions = positions_1.getPositionsForTableSize(players.length);
    var targetSeats = [];
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
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
};
exports.createTableOf = function (tableId, startingIdent, numPlayers, hasStartedNextRound) {
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
        hasStartedNextRound: hasStartedNextRound,
        players: players,
    };
};
function convertMovementsToText(movements) {
    var txt = "";
    for (var i = 0; i < movements.length; i++) {
        var m = movements[i];
        txt += "MOVEMENT " + (i + 1) + " / " + movements.length + ": ";
        txt += m.fromPlayer.name + " (" + m.fromPlayer.id + ") at table " + m.fromTable.id + " in seat " + m.fromPlayer.seat + " (" + m.fromPlayer.position + ")";
        txt += " -->";
        txt += " to table " + m.to.tableId + " in seat " + m.to.seat + " (" + m.to.position + ")";
        txt += " score: " + m.movementScore;
        txt += "\n";
    }
    // console.log(txt);
    return txt;
}
exports.convertMovementsToText = convertMovementsToText;
function doSanityChecksOnStateConfig(config) {
    if (typeof config === "undefined") {
        throw new tournamentStateError_1.TournamentStateError("Expecting state key: config");
    }
    if (typeof config !== "object") {
        throw new tournamentStateError_1.TournamentStateError("state.config must be an object");
    }
    var expectingNumericKeys = ['maxPlayersPerTable', 'breakWithLessThan', 'balanceMinFlexibility', 'balanceMaxFlexibility'];
    for (var _i = 0, expectingNumericKeys_1 = expectingNumericKeys; _i < expectingNumericKeys_1.length; _i++) {
        var key = expectingNumericKeys_1[_i];
        if (!(key in config)) {
            throw new tournamentStateError_1.TournamentStateError("state.config object must contain numeric key: " + key);
        }
        if (typeof config[expectingNumericKeys[key]] === "number" && Number.isInteger(config[expectingNumericKeys[key]])) {
            throw new tournamentStateError_1.TournamentStateError("state.config." + key + " is not an integer: " + config[expectingNumericKeys[key]]);
        }
    }
    if (config.maxPlayersPerTable > 10) {
        throw new tournamentStateError_1.TournamentStateError("state.config.maxPlayersPerTable cannot be more than 10 because PN doesnt support this many players");
    }
    if (config.maxPlayersPerTable < 2) {
        throw new tournamentStateError_1.TournamentStateError("state.config.maxPlayersPerTable cannot be less than 2 because tables need at least 2 players to be active");
    }
    if (config.breakWithLessThan < 2) {
        throw new tournamentStateError_1.TournamentStateError("state.config.breakWithLessThan must be at least 2 to break up tables with 1 player left");
    }
    if (config.balanceMinFlexibility < 0) {
        throw new tournamentStateError_1.TournamentStateError("state.config.balanceMinFlexibility must not be negative");
    }
    if (config.balanceMaxFlexibility < 0) {
        throw new tournamentStateError_1.TournamentStateError("state.config.balanceMaxFlexibility must not be negative");
    }
}
exports.doSanityChecksOnStateConfig = doSanityChecksOnStateConfig;
function doSanityChecksOnStateTables(tables) {
    if (typeof tables === "undefined") {
        throw new tournamentStateError_1.TournamentStateError("Expecting state key: tables");
    }
    if (!Array.isArray(tables)) {
        throw new tournamentStateError_1.TournamentStateError("Expecting state.tables to be an array");
    }
    var tableIdsObj = {};
    var playerIdsObj = {};
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        doSanityChecksOnTableObject(table, i, playerIdsObj);
        if (table.id in tableIdsObj) {
            throw new tournamentStateError_1.TournamentStateError("Duplicate table id found in state.tables: " + table.id);
        }
        else {
            tableIdsObj[table.id] = true;
        }
    }
    if (tables.length === 0) {
        throw new tournamentStateError_1.TournamentStateError("Expecting state.tables array to contain at least 1 table object");
    }
}
exports.doSanityChecksOnStateTables = doSanityChecksOnStateTables;
function doSanityChecksOnTableObject(table, index, playerIdsObj) {
    // Table must be an object
    if (typeof table !== "object") {
        throw new tournamentStateError_1.TournamentStateError("Non object found at index " + index + " of state.tables");
    }
    // Table must have an id of string type
    if (typeof table.id !== "string") {
        throw new tournamentStateError_1.TournamentStateError("Table at state.tables[" + index + "] must contain a unique identity string at key: id, but found: " + typeof table.id);
    }
    if (table.id === "") {
        throw new tournamentStateError_1.TournamentStateError("state.tables[" + index + "].id must not be empty string");
    }
    doSanityCheckOnSeatNumber(table.dealerButtonLastRound, "state.table[" + index + "].dealerButtonLastRound");
    if (typeof table.hasStartedNextRound !== "boolean") {
        throw new tournamentStateError_1.TournamentStateError("Table at state.tables[" + index + "] must contain boolean at key: hasStartedNextRound, but found" + typeof table.hasStartedNextRound);
    }
    // Check all players
    if (!Array.isArray(table.players)) {
        throw new tournamentStateError_1.TournamentStateError("Expecting players array at state.tables[" + index + "].players");
    }
    var seatIdsObj = {};
    for (var i = 0; i < table.players.length; i++) {
        var player = table.players[i];
        doSanityChecksOnPlayerObject(player, i, table, index);
        if (player.id in playerIdsObj) {
            throw new tournamentStateError_1.TournamentStateError("Duplicate player id " + player.id + " found at table with id: " + table.id + " previously seen at table with id: " + playerIdsObj[player.id]);
        }
        else {
            playerIdsObj[player.id] = table.id;
        }
        if (player.seat in seatIdsObj) {
            throw new tournamentStateError_1.TournamentStateError("Seat " + player.seat + " on table with id: " + table.id + " has more than 1 player in it");
        }
        else {
            seatIdsObj[player.seat] = true;
        }
    }
}
exports.doSanityChecksOnTableObject = doSanityChecksOnTableObject;
function doSanityChecksOnPlayerObject(player, playerIndex, table, tableIndex) {
    if (typeof player !== "object") {
        throw new tournamentStateError_1.TournamentStateError("Non object found at index " + playerIndex + " of state.tables[" + tableIndex + "].players");
    }
    // Player must have an id of string type
    if (typeof player.id !== "string") {
        throw new tournamentStateError_1.TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain a unique identity string at key: id, but found: " + typeof player.id);
    }
    if (player.id === "") {
        throw new tournamentStateError_1.TournamentStateError("state.tables[" + tableIndex + "].players[" + playerIndex + "].id must not be empty string");
    }
    if (typeof player.name !== "string") {
        throw new tournamentStateError_1.TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain a name string at key: name, but found: " + typeof player.name);
    }
    doSanityCheckOnSeatNumber(player.seat, "state.tables[" + tableIndex + "].players[" + playerIndex + "].seat");
    if (typeof player.movements !== "number") {
        throw new tournamentStateError_1.TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain the number of movements they have previously made at key: movements, but found: " + typeof player.movements);
    }
    if (typeof player.participatingLastRound !== "boolean") {
        throw new tournamentStateError_1.TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain whether the player participated in the previous round at key: participatingLastRound, but found: " + typeof player.participatingLastRound);
    }
    if (typeof player.participatingNextRound !== "boolean") {
        throw new tournamentStateError_1.TournamentStateError("Player at state.tables[" + tableIndex + "].players[" + playerIndex + "] must contain whether the player will participate in the next round at key: participatingNextRound, but found: " + typeof player.participatingNextRound);
    }
}
exports.doSanityChecksOnPlayerObject = doSanityChecksOnPlayerObject;
function doSanityCheckOnSeatNumber(value, stateRef) {
    if (typeof value !== "number") {
        throw new tournamentStateError_1.TournamentStateError("Expected seat position number at " + stateRef + " but found type: " + typeof value);
    }
    if (!Number.isInteger(value)) {
        throw new tournamentStateError_1.TournamentStateError("Expected seat position integer (e.g. 1-10) at " + stateRef + " but found value: " + value);
    }
    if (value < 1) {
        throw new tournamentStateError_1.TournamentStateError("Seat position cannot be less than 1 at " + stateRef + " but found value: " + value);
    }
    if (value > 10) {
        throw new tournamentStateError_1.TournamentStateError("Seat position cannot be more than 10 at " + stateRef + " but found value: " + value);
    }
}
exports.doSanityCheckOnSeatNumber = doSanityCheckOnSeatNumber;
function arrayShuffle(arr) {
    var _a;
    var newArr = arr.slice();
    for (var i = newArr.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        _a = [newArr[rand], newArr[i]], newArr[i] = _a[0], newArr[rand] = _a[1];
    }
    return newArr;
}
exports.arrayShuffle = arrayShuffle;
;
function buildTournamentState(state, config, tableIdThatCompletedHand) {
    validateTournamenState(state);
    if (!(tableIdThatCompletedHand in state.tables)) {
        throw new Error("Table id that completed hand not found in state.tables: " + tableIdThatCompletedHand);
    }
    // Get the tables array with all the players from the PN Table & Player objects
    var tables = [];
    for (var tableId in state.tables) {
        var table = state.tables[tableId];
        if (table.id !== tableId) {
            throw new Error("Table referenced as id: " + tableId + " has incorrect table.id: " + table.id);
        }
        // Import table
        var playersList = [];
        for (var _i = 0, _a = table.seats; _i < _a.length; _i++) {
            var tup = _a[_i];
            var seatNum = tup[0];
            var playerId = tup[1];
            if (!(playerId in state.players)) {
                throw new Error("Could not find player with id: " + playerId + " referenced in table with id: " + table.id);
            }
            var player = state.players[playerId];
            if (player.id !== playerId) {
                throw new Error("Player referenced as id: " + playerId + " has incorrect player.id: " + player.id);
            }
            if (player.seat !== seatNum) {
                throw new Error("Player id: " + playerId + " has inconsistent seat number: " + player.seat + " but referenced in the table model at seat number: " + seatNum);
            }
            if (player.currentTable !== tableId) {
                throw new Error("Player id: " + playerId + " has inconsistent currentTable id: " + player.currentTable + " but referenced in table with id: " + table.id);
            }
            playersList.push({
                id: player.id,
                movements: player.movements,
                name: player.name,
                participatingLastRound: true,
                // participatingNextRound: player.stack > 0,
                participatingNextRound: true,
                seat: player.seat,
            });
        }
        tables.push({
            id: table.id,
            dealerButtonLastRound: table.dealerButtonLastRound,
            hasStartedNextRound: table.id !== tableIdThatCompletedHand,
            players: playersList,
        });
    }
    return {
        config: config,
        tables: tables
    };
}
exports.buildTournamentState = buildTournamentState;
function validateTournamenState(state) {
    if (typeof state !== "object") {
        throw new Error("Tournament state expected be an object but was: " + typeof state);
    }
    if (typeof state.players !== "object") {
        throw new Error("Tournament state.players expected to be an object but was: " + typeof state.players);
    }
    Object.keys(state.players).forEach(function (playerId) {
        var player = state.players[playerId];
        validatePlayer(player);
    });
    if (typeof state.tables !== "object") {
        throw new Error("Tournament state.tables expected to be an object but was: " + typeof state.tables);
    }
    Object.keys(state.tables).forEach(function (tableId) {
        var table = state.tables[tableId];
        validateTable(table);
    });
}
function validatePlayer(player) {
    var fields = {
        id: "string",
        name: "string",
        // stack: "number",
        movements: "number",
        currentTable: "string",
        seat: "number",
    };
    Object.keys(fields).forEach(function (fieldName) {
        var expectedType = fields[fieldName];
        if (typeof player[fieldName] !== expectedType) {
            throw new Error("player." + fieldName + " expected to be " + expectedType + " but was: " + typeof player[fieldName]);
        }
    });
}
function validateTable(table) {
    if (typeof table.id !== "string") {
        throw new Error("table.id expected to be a string but was: " + typeof table.id);
    }
    if (typeof table.dealerButtonLastRound !== "number") {
        throw new Error("table.dealerButtonLastRound expected to be a number but was: " + typeof table.dealerButtonLastRound);
    }
    if (typeof table.seats !== "object" || !(table.seats instanceof Array)) {
        throw new Error("table.seats expected to be an array object but was of type: " + typeof table.seats);
    }
    table.seats.forEach(function (seat, i) {
        // Validate seat
        if (seat.length !== 2) {
            throw new Error("Seat array length at index " + i + " should be 2 for table " + table.id);
        }
        if (typeof seat[0] !== "number") {
            throw new Error("Seat at index " + i + " should be a number at index 0 for table " + table.id + " but was " + typeof seat[0]);
        }
        if (typeof seat[1] !== "string") {
            throw new Error("Seat at index " + i + " should be a string at index 1 for table " + table.id + " but was " + typeof seat[1]);
        }
    });
}
//# sourceMappingURL=util.js.map