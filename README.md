# Poker-Now-Tournament-Rebalancer

A JS algorithm to decide what player movements to make when re-balancing a multi-table tournament.

## Setup @poker-now private NPM registry

Login with your credentials

`npm login --registry=https://npm.code67.com`

Add this line to your ~/.npmrc file

`@poker-now:registry=https://npm.code67.com`

Finally, install the package with

`npm i @poker-now/tournament-rebalancer`

## Basic Usage

```javascript
const Balancer = require("@poker-now/tournament-rebalancer");
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

// This is a configuration object which controls how much table breaking and rebalancing happens.
const config: Config = {
    maxPlayersPerTable: 8,
    breakWithLessThan: 8,  // This allows table breaking (if possible) for tables with less than 8 players.
    balanceMinFlexibility: 0, // Increase these to prevent over rebalancing.
    balanceMaxFlexibility: 0, // 0 = Rebalance as much as possible
}

const result = Balancer.getMovements(state, config, "B"); // It needs to know the table that just finished its hand so it can work out future player positions better.

console.log(result.movementsText);

```

Gives

```javascript
MOVEMENT 1 / 5: Benny (P4) at table B in seat 5 (SB) --> to table A in seat 8 (D) score: 0
MOVEMENT 2 / 5: Will (P6) at table C in seat 5 (BB) --> to table A in seat 1 (SB) score: 0
MOVEMENT 3 / 5: Sarah (P8) at table C in seat 9 (SB) --> to table A in seat 3 (UTG) score: 15
MOVEMENT 4 / 5: Josh (P5) at table B in seat 6 (D) --> to table A in seat 5 (UTG+2) score: 8
MOVEMENT 5 / 5: Katie (P7) at table C in seat 7 (D) --> to table A in seat 7 (CO) score: 0
```

## Other ideas

Write a simulator which randomly generates a tournament where rounds last a random amount of time and players bust out at random intervals.
The lib is used to queue up player movements if the table that finished a hand has players to move away.
Hand completion events are processed as they would be by the system.
Ranking is also simulated.
All hands are logged by time.
Table formats are logged before and after each set of movements.
When the tournament is over, the number of movements are logged with their scores and positions.
This should hopefully help us work out the best threshold to move players at.

ANSI escape sequences which should help draw out the models to console
https://stackoverflow.com/questions/11474391/is-there-go-up-line-character-opposite-of-n

Or

Write a web frontend where you can configure the setup, add a random table with x players on it and visualise each table, and visualise the movements and apply the movements.
Then also have a mode where random busts occur and movements are auto applied in real time.
Tables finish rounds independantly, with dead button logic for bust outs.
Random round times, random stack changes, and random bust outs based on probabilities.
Everything rendered in canvas.

