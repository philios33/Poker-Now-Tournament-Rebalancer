"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Balancer = require('./index');
var state = {
    "players": {
        "samuel2": {
            "id": "samuel2",
            "name": "samuel2",
            "currentTable": "OGLRmg1latOvKkjZZuaPPcu97",
            "movements": 0,
            "seat": 2,
        },
        "samuel4": {
            "id": "samuel4",
            "name": "samuel4",
            "currentTable": "sxCxAxrVhHODTHXIJPcRjGeGz",
            "movements": 0,
            "seat": 2,
        },
        "samuel1": {
            "id": "samuel1",
            "name": "samuel1",
            "currentTable": "sxCxAxrVhHODTHXIJPcRjGeGz",
            "movements": 0,
            "seat": 1,
        }
    },
    "tables": {
        "OGLRmg1latOvKkjZZuaPPcu97": {
            "id": "OGLRmg1latOvKkjZZuaPPcu97",
            "dealerButtonLastRound": 1,
            "seats": [
                [
                    2,
                    "samuel2"
                ]
            ]
        },
        "sxCxAxrVhHODTHXIJPcRjGeGz": {
            "id": "sxCxAxrVhHODTHXIJPcRjGeGz",
            "dealerButtonLastRound": 1,
            "seats": [
                [
                    2,
                    "samuel4"
                ],
                [
                    1,
                    "samuel1"
                ]
            ]
        }
    }
};
var config = {
    maxPlayersPerTable: 2,
    breakWithLessThan: 2,
    balanceMinFlexibility: 0,
    balanceMaxFlexibility: 0 // 0 = Rebalance as much as possible
};
var result = Balancer.getMovements(state, config, "OGLRmg1latOvKkjZZuaPPcu97");
console.log(result.movementsText);
console.log("Total movements: " + result.movements.length);
console.log("Total score: " + result.totalScore);
console.log("Stats", result.stats),
    console.log("Took", result.msTaken + " ms");
//# sourceMappingURL=start.js.map