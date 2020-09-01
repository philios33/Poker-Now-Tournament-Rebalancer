"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balancer_1 = require("./lib/balancer");
var state = {
    config: {
        maxPlayersPerTable: 4,
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
                    movements: 0,
                    participatingLastRound: false,
                    participatingNextRound: true,
                    seat: 7,
                }
            ],
            dealerButtonLastRound: 6,
            extraPlayers: 0,
        },
        {
            id: "2",
            players: [
                {
                    id: "P4",
                    name: "P4",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "P45",
                    name: "P45",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 6,
                }
            ],
            dealerButtonLastRound: 6,
            extraPlayers: 0,
        },
        {
            id: "3",
            players: [
                {
                    id: "P5",
                    name: "P5",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
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
//# sourceMappingURL=test1.js.map