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

ANSI escape sequences which should help draw out the models to console
https://stackoverflow.com/questions/11474391/is-there-go-up-line-character-opposite-of-n

Or

Write a web frontend where you can configure the setup, add a random table with x players on it and visualise each table, and visualise the movements and apply the movements.
Then also have a mode where random busts occur and movements are auto applied in real time.
Tables finish rounds independantly, with dead button logic for bust outs.
Random round times, random stack changes, and random bust outs based on probabilities.
Everything rendered in canvas.

