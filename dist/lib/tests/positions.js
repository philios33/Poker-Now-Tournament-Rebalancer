"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var positions_1 = require("../positions");
test('Reports correct table positions for table sizes', function () {
    expect(positions_1.getPositionsForTableSize(2)).toStrictEqual(['D', 'SB']);
    expect(positions_1.getPositionsForTableSize(7)).toStrictEqual(['D', 'SB', 'BB', 'UTG', 'UTG+1', 'HJ', 'CO']);
    expect(positions_1.getPositionsForTableSize(8)).toStrictEqual(['D', 'SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'HJ', 'CO']);
    expect(positions_1.getPositionsForTableSize(9)).toStrictEqual(['D', 'SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'UTG+3', 'HJ', 'CO']);
    expect(positions_1.getPositionsForTableSize(10)).toStrictEqual(['D', 'SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'UTG+3', 'UTG+4', 'HJ', 'CO']);
});
test('rotateArray', function () {
    var objA = { id: 'A' };
    var objB = { id: 'B' };
    var objC = { id: 'C' };
    var start = [objA, objB, objC];
    positions_1.rotateArray(start, 1);
    expect(start).toStrictEqual([objB, objC, objA]);
    positions_1.rotateArray(start, 2);
    expect(start).toStrictEqual([objA, objB, objC]);
    positions_1.rotateArray(start, 0);
    expect(start).toStrictEqual([objA, objB, objC]);
});
test('expandTablePositionsAsLastRound', function () {
    var table = {
        id: "test",
        players: [{
                id: "1",
                name: "1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "3",
                name: "3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }],
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('1');
    expect(table.players[0].position).toBe('D');
    expect(table.players[1].id).toBe('2');
    expect(table.players[1].position).toBe('SB');
    expect(table.players[2].id).toBe('3');
    expect(table.players[2].position).toBe('BB');
});
test('expandTablePositionsAsLastRound + 1 hand', function () {
    var table = {
        id: "test",
        players: [{
                id: "1",
                name: "1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "3",
                name: "3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }],
        dealerButtonLastRound: 1,
        hasStartedNextRound: true,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('1');
    expect(table.players[0].position).toBe('BB');
    expect(table.players[1].id).toBe('2');
    expect(table.players[1].position).toBe('D');
    expect(table.players[2].id).toBe('3');
    expect(table.players[2].position).toBe('SB');
});
test('Table Position Expansion - Ignore whether in next round or not', function () {
    var table = {
        id: "test",
        players: [{
                id: "1",
                name: "1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: false,
                seat: 1,
            }, {
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "3",
                name: "3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }],
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('1');
    expect(table.players[0].position).toBe('D');
    expect(table.players[1].id).toBe('2');
    expect(table.players[1].position).toBe('SB');
    expect(table.players[2].id).toBe('3');
    expect(table.players[2].position).toBe('BB');
});
test('Table Position Expansion - Unordered seats, auto sorting by seat', function () {
    var table = {
        id: "test",
        players: [{
                id: "3",
                name: "3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "1",
                name: "1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }],
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('1');
    expect(table.players[0].position).toBe('D');
    expect(table.players[1].id).toBe('2');
    expect(table.players[1].position).toBe('SB');
    expect(table.players[2].id).toBe('3');
    expect(table.players[2].position).toBe('BB');
});
test('Table Position Expansion - Ignore seat gaps', function () {
    var table = {
        id: "test",
        players: [{
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "5",
                name: "5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "9",
                name: "9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }],
        dealerButtonLastRound: 2,
        hasStartedNextRound: false,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('2');
    expect(table.players[0].position).toBe('D');
    expect(table.players[1].id).toBe('5');
    expect(table.players[1].position).toBe('SB');
    expect(table.players[2].id).toBe('9');
    expect(table.players[2].position).toBe('BB');
});
test('Table Position Expansion - Consider rotation around table', function () {
    var table = {
        id: "test",
        players: [{
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "5",
                name: "5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "9",
                name: "9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }],
        dealerButtonLastRound: 5,
        hasStartedNextRound: false,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('2');
    expect(table.players[0].position).toBe('BB');
    expect(table.players[1].id).toBe('5');
    expect(table.players[1].position).toBe('D');
    expect(table.players[2].id).toBe('9');
    expect(table.players[2].position).toBe('SB');
});
test('Table Position Expansion - Consider dead button', function () {
    var table = {
        id: "test",
        players: [{
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "5",
                name: "5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "9",
                name: "9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }],
        dealerButtonLastRound: 4,
        hasStartedNextRound: false,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('2');
    expect(table.players[0].position).toBe('UTG');
    expect(table.players[1].id).toBe('5');
    expect(table.players[1].position).toBe('SB');
    expect(table.players[2].id).toBe('9');
    expect(table.players[2].position).toBe('BB');
});
test('Table Position Expansion - Consider dead button + 1 hand', function () {
    var table = {
        id: "test",
        players: [{
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "5",
                name: "5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "9",
                name: "9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }],
        dealerButtonLastRound: 4,
        hasStartedNextRound: true,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('2');
    expect(table.players[0].position).toBe('BB');
    expect(table.players[1].id).toBe('5');
    expect(table.players[1].position).toBe('D');
    expect(table.players[2].id).toBe('9');
    expect(table.players[2].position).toBe('SB');
});
test('Table Position Expansion - Dont consider players that didnt participate', function () {
    var table = {
        id: "test",
        players: [{
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "5",
                name: "5",
                movements: 0,
                participatingLastRound: false,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "9",
                name: "9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }],
        dealerButtonLastRound: 5,
        hasStartedNextRound: false,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('2');
    expect(table.players[0].position).toBe('BB');
    expect(table.players[1].id).toBe('5');
    expect(table.players[1].position).toBe(undefined);
    expect(table.players[2].id).toBe('9');
    expect(table.players[2].position).toBe('SB');
});
test('Table Position Expansion - Dont consider players that didnt participate + 1 hands forward', function () {
    var table = {
        id: "test",
        players: [{
                id: "2",
                name: "2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "5",
                name: "5",
                movements: 0,
                participatingLastRound: false,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "9",
                name: "9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }],
        dealerButtonLastRound: 5,
        hasStartedNextRound: true,
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('2');
    expect(table.players[0].position).toBe('SB');
    expect(table.players[1].id).toBe('5');
    expect(table.players[1].position).toBe('BB');
    expect(table.players[2].id).toBe('9');
    expect(table.players[2].position).toBe('D');
});
test("Seat positions if rounds started already", function () {
    var table = {
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
    };
    positions_1.expandTablePositionsAsLastRound(table);
    expect(table.players[0].id).toBe('6');
    expect(table.players[0].position).toBe('BB');
    expect(table.players[1].id).toBe('7');
    expect(table.players[1].position).toBe('D');
    expect(table.players[2].id).toBe('8');
    expect(table.players[2].position).toBe('SB');
});
//# sourceMappingURL=positions.js.map