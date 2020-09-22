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
const tournament = {
    config: {
        maxPlayersPerTable: 10,
    },
    tables: [
        {
            id: "A",
            dealerButtonLastRound: 1,
            players: [
                {
                    id: "1",
                    name: "1",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 1,
                }
            ]
        },
        {
            id: "B",
            dealerButtonLastRound: 1,
            players: [
                {
                    id: "2",
                    name: "2",
                    movements: 0,
                    participatingLastRound: true,
                    participatingNextRound: true,
                    seat: 1,
                }
            ]
        }
    ]
}
const result = Balancer.getRebalancingPlayerMovements(tournament);
for(const movement of result.movements) {
    console.log("Move Table " + movement.fromTable.id + " Seat " + movement.fromPlayer.seat + " -> Table " + movement.to.tableId + " Seat " + movement.to.seat);
}
```

Gives

```javascript
Move Table A Seat 1 -> Table B Seat 2
```

TODO

Implement position check based on Table.hasStartedNextRound
    If a fromTable has started their round, they have already participated in the next round, so the players next position should be rotated twice.
    If a targetTable has started their round (most of the time), we need to rotate the next round positions two times and just assume that nobody will bust.
    Add basic position tests for this.

---

Add more flexibility tests

Add test for a table break and a rebalance at the same time: e.g. 2,6,10,10,10,10,10,10,10

Add test for 8,8,10,10,10,10,10,10,10 situation
Add tests for:
5,7,8,10 = 30, Get rid of A and use 3 full tables.
6,7,8,10 = 31, Optimal players (7 or 8), so move 2 from D to A
6,6,9,10 = 31, Optimal players (7 or 8), so move 1 from C, 2 from D, Then 1 on A, 1 on B, and the last on either A or B
5,10,10,10,10,10,10

---

Look at flexibility config again.  
Can we reduce the sensitivity but still make optimal movements when they happen?
I can't think why we would NOT want to do this.  Make another two config values for this!

---

Add converter to map Sam's tournament state format in to my structure.  
E.g. Logic for if stack=0 we assume participatingNextRound=false
And unless we can get the data for participatingLastRound (for dead button reasons), we must assume that all players participated.

---

Write a simulator which randomly generates a tournament where rounds last a random amount of time and players bust out at random intervals.
The lib is used to queue up player movements if the table that finished a hand has players to move away.
Hand completion events are processed as they would be by the system.
Ranking is also simulated.
All hands are logged by time.
Table formats are logged before and after each set of movements.
When the tournament is over, the number of movements are logged with their scores and positions.
This should hopefully help us work out the best threshold to move players at.