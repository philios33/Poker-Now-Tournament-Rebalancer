
## Thoughts from @awolf

for MTT, there's re-balancing and there's breaking a table. they are separate actions.

rebalancing: say you have 2 tables with 10 people each. then 2 players bust out on one table leaving 8 players on one table and 10 on the other. in this case you rebalance by removing a player from the 10 player and placing them on the 8 player table. AND as an optional optimization, since you can choose a player from any position on the 10 player table and you know the target seats available on the 8 player table, you can choose a player from the 10 person table who will end up in roughly the same position relative to blinds on the 8 player table. this second piece is only an optimization though, it would be fine to not have this

breaking a table: say you have two tables with 6 players and 5 players. combined, there are too many people for a 10 player table so it is correct for the tables to remain apart. now imagine a player busts out. you should break a table by choosing the table with the fewest players, and randomly assigning them to seats on the non-broken table. one exception to this that I have seen, is for the final table. this table matters the most since no other position changes will happen for the rest of the game, and the most is on the line. for the final table it makes sense to re-shuffle everyone. this is also an optional improvement though.
there are a few other minor requirements I can think of: 

 * payout scheme calculation (e.g. what if there are 300 players in a tournament.. not just the final table gets paid)
 * sign up management how do 300 people get ready to be placed on their starting tables when the tournament starts?

happy to help plan some of these when it becomes time
oh one other thing with table breaking: the example I gave only had 2 tables. however, if there were n tables you'd spread the broken players out on the n-1 remaining tables (making the final seat counts as even as possible). fun comp science problem :D

## Thoughts from @philios33

Step 1 is to work out how many table movements are necessary (e.g. Max Players per table = 10):
 * [3,7,10] => Move 3 from table 1 to table 2 => [0,10,10] (3 moves)
 * [3,8,10] => Move 1 from table 2 to table 1, Move 3 from table 3 to table 1 => [7,7,7] (4 moves)
 * [10,10,2] => Move 3 from table 1 to table 3, Move 2 from table 2 to table 3 => [7,8,7] (5 moves)
 * [6,7,8] => Move 1 from table 3 to table 1 => [7,7,7] (1 move)

This is relatively easy to do with some simple sums.

`getRebalancingMovements(state);`

Step 2 is choosing who to move.  I would write a heuristic to rate how good a movement is, based on position and number of movements made already, try every combination and take the best one.  This is a bit harder to do.

`getRebalancingPlayerMovements(state);`

I think the `getRebalancingMovements` can be called quite often and this can be used when to trigger a table rebalancing.  But it probably should be noted that tables can rebalance themselves naturally, which means you maybe trigger a rebalancing to happen when there are >2 movements to make.  Once a rebalancing is triggered, you need to pause the entire tournament by waiting for all tables to finish the current hand.  Then re-evaluate the tournament state with `getRebalancingPlayerMovements` and do the swaps.  The re-evaulation is needed because something big could happen between triggering the doing the rebalancing.  And you need to pause ALL tables so you can re-evaluate the tournament when it's in a fixed paused state.

## Example usage

```sh
npm i poker-now-tournament-rebalancer
```

```js
const { getRebalancingPlayerMovements } = require('poker-now-tournament-rebalancer');

const state = {
    config: {
        maxPlayersPerTable: 4,
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
        },
    ]
};
const result = getRebalancingPlayerMovements(state);
for(const movement of result.movements) {
    console.log("MOVE Player " + JSON.stringify(movement.fromPlayer) + " at table " + movement.fromTable.id + " -> to Table " + movement.to.tableId + " Seat " + movement.to.seat + " New Position " + movement.to.position);
}
console.log("Total movements: " + result.movements.length);
console.log("Total score: " + result.totalScore);
```

Outputs

```js
numberOfPlayersNextRound = 8
optimalNumberOfTables = 2
currentNumberOfTables = 3
maxNumberOfPlayersOnTables = 4
Breaking up table 2
MOVE Player {"id":"5","name":"P5","movements":0,"participatingLastRound":true,"participatingNextRound":true,"seat":6,"position":"D"} at table 2 -> to Table 1 Seat 1 New Position SB
MOVE Player {"id":"4","name":"P4","movements":0,"participatingLastRound":true,"participatingNextRound":true,"seat":5,"position":"SB"} at table 2 -> to Table 3 Seat 6 New Position D
Total movements: 2
Total score: 10
```


## Other thoughts

1. We need a tournament page where players can see all tables and click on them to open them up in new tabs.
This is similar to the game page.  You connect a socket, grab the current tournament state and listen for tournament update events.
The page simply renders the tournament state with react components.  We can reuse the same actions queue, state & brains idea that worked so well for you in the past.  Anyone with the tournament id can view the tournament page.  Admins can control the tournament in real time by sending actions that alter the state via the tournament brains.