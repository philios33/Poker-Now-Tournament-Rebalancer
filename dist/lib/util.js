"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableOf = exports.workOutTargetSeatPositions = exports.getSeatListOfActivePlayers = exports.randomlyChooseTables = exports.multiplyArrays = exports.convertSeatMovementToPlayerMovement = exports.findPlayerBySeat = exports.findTableById = exports.invertSeatList = exports.combine = exports.getTableIdCombinations = exports.getTableCombinations = void 0;
var positions_1 = require("./positions");
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
    tableListId.sort(function () { return Math.random() - 0.5; });
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
//# sourceMappingURL=util.js.map