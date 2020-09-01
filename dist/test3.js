"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balancer_1 = require("./lib/balancer");
var state = {
    config: {
        maxPlayersPerTable: 6,
    },
    tables: [
        {
            id: "1",
            players: [
                {
                    id: "P1",
                    name: "P1",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "P2",
                    name: "P2",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 6,
                },
                {
                    id: "P3",
                    name: "P3",
                    movements: 1,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 7,
                },
                {
                    id: "P4",
                    name: "P4",
                    movements: 2,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 8,
                },
                {
                    id: "P5",
                    name: "P5",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 9,
                },
                {
                    id: "P6",
                    name: "P6",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 10,
                }
            ],
            dealerButtonLastRound: 6,
            extraPlayers: 0,
        },
        {
            id: "2",
            players: [
                {
                    id: "P7",
                    name: "P7",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "P8",
                    name: "P8",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 6,
                },
                {
                    id: "P9",
                    name: "P9",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 7,
                },
                {
                    id: "P10",
                    name: "P10",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 8,
                },
                {
                    id: "P11",
                    name: "P11",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 9,
                },
                {
                    id: "P12",
                    name: "P12",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 10,
                }
            ],
            dealerButtonLastRound: 6,
            extraPlayers: 0,
        },
        {
            id: "3",
            players: [
                {
                    id: "P13",
                    name: "P13",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "P14",
                    name: "P14",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 7,
                }
            ],
            dealerButtonLastRound: 5,
            extraPlayers: 0,
        },
    ]
};
var result = balancer_1.getRebalancingPlayerMovements(state);
for (var _i = 0, _a = result.movements; _i < _a.length; _i++) {
    var movement = _a[_i];
    console.log("MOVE Player " + JSON.stringify(movement.fromPlayer) + " at table " + movement.fromTable.id + " -> to Table " + movement.to.tableId + " Seat " + movement.to.seat + " New Position " + movement.to.position);
}
console.log("Total movements: " + result.movements.length);
console.log("Total score: " + result.totalScore);
//# sourceMappingURL=test3.js.map