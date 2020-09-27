"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balancer_1 = require("./lib/balancer");
var state = {
    config: {
        maxPlayersPerTable: 4,
        breakWithLessThan: 4,
        balanceMaxFlexibility: 0,
        balanceMinFlexibility: 0,
    },
    tables: [
        {
            id: "1",
            players: [
                {
                    id: "1",
                    name: "P1",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "2",
                    name: "P2",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 6,
                },
                {
                    id: "3",
                    name: "P3",
                    movements: 0,
                    participatingLastRound: false,
                    participatingNextRound: true,
                    seat: 7,
                }
            ],
            dealerButtonLastRound: 6,
            hasStartedNextRound: true,
        },
        {
            id: "2",
            players: [
                {
                    id: "4",
                    name: "P4",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "5",
                    name: "P5",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 6,
                }
            ],
            dealerButtonLastRound: 6,
            hasStartedNextRound: false,
        },
        {
            id: "3",
            players: [
                {
                    id: "6",
                    name: "P6",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 5,
                },
                {
                    id: "7",
                    name: "P7",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 7,
                },
                {
                    id: "8",
                    name: "P8",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 8,
                }
            ],
            dealerButtonLastRound: 5,
            hasStartedNextRound: true,
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
console.log("Stats", result.stats),
    console.log("Took", result.msTaken + " ms");
//# sourceMappingURL=start.js.map