"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
test('Table Creator', function () {
    expect(util_1.createTableOf("A", "1", 10, false)).toStrictEqual({
        id: "A",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
                id: "1",
                name: "TAS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "2",
                name: "TAS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "3",
                name: "TAS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "4",
                name: "TAS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }, {
                id: "5",
                name: "TAS5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "6",
                name: "TAS6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 6,
            }, {
                id: "7",
                name: "TAS7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            }, {
                id: "8",
                name: "TAS8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }, {
                id: "9",
                name: "TAS9",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 9,
            }, {
                id: "10",
                name: "TAS10",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 10,
            }]
    });
    expect(util_1.createTableOf("B", "11", 8, false)).toStrictEqual({
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
                id: "11",
                name: "TBS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "12",
                name: "TBS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "13",
                name: "TBS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "14",
                name: "TBS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }, {
                id: "15",
                name: "TBS5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "16",
                name: "TBS6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 6,
            }, {
                id: "17",
                name: "TBS7",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 7,
            }, {
                id: "18",
                name: "TBS8",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 8,
            }]
    });
    expect(util_1.createTableOf("A", "1", 4, false)).toStrictEqual({
        id: "A",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
                id: "1",
                name: "TAS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "2",
                name: "TAS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "3",
                name: "TAS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "4",
                name: "TAS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }]
    });
    expect(util_1.createTableOf("B", "5", 6, false)).toStrictEqual({
        id: "B",
        dealerButtonLastRound: 1,
        hasStartedNextRound: false,
        players: [{
                id: "5",
                name: "TBS1",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 1,
            }, {
                id: "6",
                name: "TBS2",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 2,
            }, {
                id: "7",
                name: "TBS3",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 3,
            }, {
                id: "8",
                name: "TBS4",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 4,
            }, {
                id: "9",
                name: "TBS5",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 5,
            }, {
                id: "10",
                name: "TBS6",
                movements: 0,
                participatingLastRound: true,
                participatingNextRound: true,
                seat: 6,
            }]
    });
});
//# sourceMappingURL=tableCreator.js.map