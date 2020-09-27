

import { PokerNowTournamentState } from './types/pokerNowTournamentState';
import { Config } from './types/config';

const Balancer = require('./index');

const state: PokerNowTournamentState = {
    players: {
        "P1": {
            id: "P1",
            name: "Phil",
            currentTable: "A",
            movements: 0,
            seat: 2,
            stack: 1000,
        },
        "P2": {
            id: "P2",
            name: "Sam",
            currentTable: "A",
            movements: 1,
            seat: 4,
            stack: 1000,
        },
        "P3": {
            id: "P3",
            name: "Clive",
            currentTable: "A",
            movements: 0,
            seat: 6,
            stack: 1000,
        },
        "P4": {
            id: "P4",
            name: "Benny",
            currentTable: "B",
            movements: 0,
            seat: 5,
            stack: 1000,
        },
        "P5": {
            id: "P5",
            name: "Josh",
            currentTable: "B",
            movements: 0,
            seat: 6,
            stack: 1000,
        },
        "P6": {
            id: "P6",
            name: "Will",
            currentTable: "C",
            movements: 0,
            seat: 5,
            stack: 1000,
        },
        "P7": {
            id: "P7",
            name: "Katie",
            currentTable: "C",
            movements: 0,
            seat: 7,
            stack: 1000,
        },
        "P8": {
            id: "P8",
            name: "Sarah",
            currentTable: "C",
            movements: 0,
            seat: 9,
            stack: 1000,
        }
    },
    tables: {
        "A": {
            id: "A",
            dealerButtonLastRound: 6,
            seats: [
                [2, "P1"],
                [4, "P2"],
                [6, "P3"],
            ]
        },
        "B": {
            id: "B",
            dealerButtonLastRound: 6,
            seats: [
                [5, "P4"],
                [6, "P5"],
            ]
        },
        "C": {
            id: "C",
            dealerButtonLastRound: 5,
            seats: [
                [5, "P6"],
                [7, "P7"],
                [9, "P8"],
            ]
        }
    }
};

const config: Config = {
    maxPlayersPerTable: 8,
    breakWithLessThan: 8,
    balanceMinFlexibility: 0,
    balanceMaxFlexibility: 0,
}

const result = Balancer.getMovements(state, config, "B");
console.log(result.movementsText);
console.log("Total movements: " + result.movements.length);
console.log("Total score: " + result.totalScore);
console.log("Stats", result.stats),
console.log("Took", result.msTaken + " ms");

