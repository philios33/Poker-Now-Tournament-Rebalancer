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
