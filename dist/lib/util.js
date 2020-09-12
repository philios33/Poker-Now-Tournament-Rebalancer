"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplyArrays = exports.convertSeatMovementToPlayerMovement = exports.findPlayerBySeat = exports.findTableById = exports.invertSeatList = exports.combine = exports.getTableCombinations = void 0;
exports.getTableCombinations = function (tables, choose) {
    return exports.combine(tables, choose).filter(function (p) { return p.length === choose; });
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
exports.multiplyArrays = function (array1, array2) {
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
                result.push(__spreadArrays(array1Item, array2Item));
            }
        }
        return result;
    }
};
//# sourceMappingURL=util.js.map