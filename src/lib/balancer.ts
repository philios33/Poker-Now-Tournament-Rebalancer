
import { TournamentState } from "../types/tournamentState"
import { Table } from "../types/table";
import { Player } from "../types/player";
import SeatSelections from "../classes/seatSelections";
import { BalancingMovementsResult } from "../types/balancingMovementsResult";
import { SeatSelection } from "../types/seatSelection";
import { getPositionsForTableSize, rotatePlayers, expandTablePositionsAsLastRound } from "./positions";
import { TargetSeat } from "../types/targetSeat";
import { SeatPosition } from "../types/seatPosition";
import { SeatPositions } from "../types/seatPositions";
import { getOptimalPlayerMovements } from "./movement";
import { BalancingPlayersResult } from "../types/balancingPlayersResult";
import { SeatMovement } from "../types/seatMovement";
import { PlayerMovement } from "../types/playerMovement";

export const getNumberOfPlayersNextRound = (state: TournamentState): number => {
    let numberOfPlayers = 0;
    for(let table of state.tables) {
        numberOfPlayers += table.players.filter(p => p.participatingNextRound).length;
    }
    return numberOfPlayers;
}

const pokerNowMaxSeatId = 10;
const playerMovementsWeighting = 10;
// This means that 10 player movements is equivalent to 1 seated position
// A table with 5 players and zero total player movements will be chosen to break up over a table with only 4 players which have had 10 player movements already

export const getTableSizeAndMovementsScore = (table: Table): number => {
    let score = 0;
    table.players.filter(p => p.participatingNextRound).map(player => {
        score += playerMovementsWeighting + player.movements
    });
    return score;
}

export const getTablesWithLeastSizeAndMovements = (state: TournamentState, num: number): Array<Table> => {
    // First score each table by number of players remaining and number of movements made already
    // So if it's a tie, the table with the players which have made the least number of existing table movements will be chosen to break up
    let orderedTables = state.tables.sort((a: Table,b: Table): number => {
        const scoreA = getTableSizeAndMovementsScore(a);
        const scoreB = getTableSizeAndMovementsScore(b);
        return scoreA - scoreB;
    });
    return orderedTables.slice(0, num);
}

/*
const getAllPlayersInNextRound = (tables: Array<Table>): Array<Player> => {
    const all = [];
    for(const table of tables) {
        all.push(...table.players.filter(p => p.participatingNextRound));
    }
    return all;
}
*/

export const getTablesWithLowestSize = (tables: Array<Table>): Array<Table> => {
    let lowestSize = 100;
    for(const table of tables) {
        let tableSize = table.players.filter(p => p.participatingNextRound).length + table.extraPlayers; // Consider extra players assigned here
        if (tableSize < lowestSize) {
            lowestSize = tableSize;
        }
    }
    // Then return all tables with this size
    const toReturn: Array<Table> = [];
    for(const table of tables) {
        let tableSize = table.players.filter(p => p.participatingNextRound).length + table.extraPlayers; // Consider extra players assigned here
        if (tableSize === lowestSize) {
            toReturn.push(table);
        }
    }
    return toReturn;
}

export const getTableCombinations = (tables: Array<Table>, choose: number) => {
    return combine(tables, choose).filter(p => p.length === choose);
}

export const combine = function(a, min) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}


export const seatsWithout = (seatIdList: Array<number>) => {
    const negatedList = [];
    for(let i=1; i<pokerNowMaxSeatId; i++) {
        if (seatIdList.indexOf(i) === -1) {
            negatedList.push(i);
        }
    }
    return negatedList;
}

export const getRebalancingMovements = (state: TournamentState): BalancingMovementsResult => {

    let numberOfPlayersNextRound = getNumberOfPlayersNextRound(state);
    let optimalNumberOfTables = Math.ceil(numberOfPlayersNextRound / state.config.maxPlayersPerTable);
    let currentNumberOfTables = state.tables.length;

    let maxNumberOfPlayersOnTables = Math.ceil(numberOfPlayersNextRound / optimalNumberOfTables);

    console.log("numberOfPlayersNextRound = " + numberOfPlayersNextRound);
    console.log("optimalNumberOfTables = " + optimalNumberOfTables);
    console.log("currentNumberOfTables = " + currentNumberOfTables);
    console.log("maxNumberOfPlayersOnTables = " + maxNumberOfPlayersOnTables);


    let fromSeats = new SeatSelections();
    let totalNumberOfMovements = 0;

    let tableIdsBeingBrokenUp = [];

    if (optimalNumberOfTables < currentNumberOfTables) {
        let numberOfTablesToBreakUp = currentNumberOfTables - optimalNumberOfTables;

        // Break up the tables with the lowest number of people
        let tables = getTablesWithLeastSizeAndMovements(state, numberOfTablesToBreakUp);
        for(let table of tables) {
            console.log("Breaking up table", table.id);
            let activeSeats = table.players.filter(p => p.participatingNextRound).map(p => p.seat);
            fromSeats.add(table.id, activeSeats, activeSeats.length); // Move everyone
            totalNumberOfMovements += activeSeats.length;

            // Remove from tableSizes counter object
            tableIdsBeingBrokenUp.push(table.id);
        }
    }

    let tablesAfter = []
    for(let table of state.tables) {
        if (tableIdsBeingBrokenUp.indexOf(table.id) === -1) {
            tablesAfter.push(table);
            table.extraPlayers = 0;
        }
    }

    // We also need to move those players on tables which now have too many players
    for(let table of state.tables) {
        const playersParticipatingNextRound = table.players.filter(p => p.participatingNextRound).length;
        if (playersParticipatingNextRound > maxNumberOfPlayersOnTables) {
            const movementsFromTable = playersParticipatingNextRound - maxNumberOfPlayersOnTables;
            console.log("Moving " + movementsFromTable + " players from table " + table.id);
            fromSeats.add(table.id, table.players.filter(p => p.participatingNextRound).map(p => p.seat), movementsFromTable);
            totalNumberOfMovements += movementsFromTable;
        }
    }

    // At this point, we know how many movements "from" there will be.
    // Assign each player to the table with the smallest number of players until we have run out of extra players
    // BUT what if it is a tie for target table?  It would go by position, so we need to know which table to choose.  AHHHHHHHHH
    // CAN WE DO AN OR IN THE SEAT SELECTION OBJECT???
    // Move 1 player from table 6 to table 1
    // Move 1 player from table 6 to table 2
    // Move 1 player from table 6 to one of [1,2,3,4,5]
    // 5,5,6,6,6,10 => 6,6,6,6,6,8 => 
    // 38 so 4 tables max
    // Break up T1 & T2
    // A movement of 10 players: 4 to T3, 3 to T4, 3 to T5, but how do we choose that T3 should get the extra person over T4 or T5.
    // We can't.  We must try all combos.
    // Either: 4 to T3, 3 to T4, 3 to T5
    // Either: 3 to T3, 4 to T4, 3 to T5
    // Either: 3 to T3, 3 to T4, 4 to T5
    // So there are 3 combinations of scenario already:
    // We CAN define this as an array of target SeatSelections
    // This is useful because we can expand each one and try every set of combinations as the target.

    let remainingMovements = totalNumberOfMovements;
    while (remainingMovements > 0) {
        let lowestTables = getTablesWithLowestSize(tablesAfter);
        // console.log(remainingMovements + " remaining.  Number of lowest tables is " + lowestTables.length);
        if (lowestTables.length <= remainingMovements) {
            // If there is a tie when assigning the next player to a table, just assign a player to each table.
            for(const table of lowestTables) {
                table.extraPlayers++;
                remainingMovements--;
            }
        } else {
            // So there are remainingMovements still to assign but lowestTables.length to choose from.
            // We need to fork the SeatSelections object for each combination
            console.log("There are " + remainingMovements + " still to assign but " + lowestTables.length + " to choose from");
            break;
        }
    }

    // console.log("tablesAfter is", tablesAfter);
    // Make the primary SeatSelections
    let toSeats: SeatSelections = new SeatSelections();
    for(const table of tablesAfter) {
        if (table.extraPlayers > 0) {
            toSeats.add(table.id, seatsWithout(table.players.filter(p => p.participatingNextRound).map(p => p.seat)), table.extraPlayers);
        }
    }
    
    let targetSeats: Array<SeatSelections> = [];
    
    // console.log("Initial target seats", targetSeats);

    if (remainingMovements > 0) {
        let lowestTables = getTablesWithLowestSize(tablesAfter);
        let tableCombinations: Array<Array<Table>> = getTableCombinations(lowestTables, remainingMovements);

        // console.log("Remaining movements", remainingMovements);
        // console.log("Table Combos", JSON.stringify(tableCombinations, null, 4));

        for(const tableCombo of tableCombinations) {
            // Branch the primary toSeats
            let anotherSeatSelections = new SeatSelections(toSeats);
            for(const table of tableCombo) {
                anotherSeatSelections.add(table.id, seatsWithout(table.players.filter(p => p.participatingNextRound).map(p => p.seat)), 1);
            }
            // console.log("anotherSeatSelections", anotherSeatSelections);
            targetSeats.push(anotherSeatSelections);
        }
    } else {
        targetSeats.push(toSeats);
    }

    // console.log("From Seats", fromSeats);
    // console.log("Target Seats", targetSeats);

    return {
        movements: totalNumberOfMovements,
        fromSeats,
        targetSeats,
    }

    // These players should be moved to the other tables seats without breaching the maximum number at a table
    // We need to know which table seats are available and how many per table can be used
    /*
    [
        {
            tableId: 1,
            seatIdList: [2,4,6],
            choose: 2,
        }
    ]
    // E.g. Choose 1 or 2 target seats from these 3 seats [2,4,6]

    // The same with tables that are too large and need to move people off. E.g. A Table of 10 players needs to decrease by 2 if max target is 8
    [
        {
            tableId: 2,
            seatIdList: [1,2,3,4,5,6,7,8,9,10],
            choose: 2,
        }
    ]

    // Create an array of movement selections like this where "from" key contains all tables to break up and the tables with too many people on.
    // And the "to" key contains the destination seat list with "choose" key to determine how many seats should be taken.

    // Then we can create an array of all possible seat selections for the from and to list.
    // Both lists do not contain duplicate combinations.

    // Then we need to expand every combination by from table too.
    // E.g. Given the 55 combos of 2 players from T2 to move + 1 possible combo of all players from T3 to move, find every different ordering possible for these seats.
    
    T2S1, T2S2
    T2S1, T2S3
    T2S1, T2S4
    ....
    T2S9, T2S10
    T3S1, T3S2, T3S3, T3S4

    Multiplying out for each table gives every combination of player from moving.

    T3S1, T3S2, T3S3, T3S4, T2S1, T2S2
    T3S1, T3S2, T3S3, T3S4, T2S1, T2S3
    T3S1, T3S2, T3S3, T3S4, T2S1, T2S4
    ...

    For every selection, expand it to try every possible seat order.  E.g. Combo of 6 will expand to:

    123456
    123465
    123654
    126453
    163452
    623451
    123546
    125436
    153426
    523416

    6! combos = 720

    // For every item selection combination in the from list, try this with every target selection combination and score it using the positional algorithm.
    // So in this scenario it might be 2 seats from table 1 out of [1,6,7,8], 2 seats from table 2 out of [1,2,3], 2 seats from table 3 out of [1,5,6,7,8,9]
    // We need to find every combination for each table, but at least it can be ordered.
    // Table 1 [1,6],[1,7],[1,8],[6,7],[6,8],[7,8] (6 combos)
    // Table 2 [1,2],[2,3],[1,3] (3 combos)
    // Table 3 [1,5],[1,6],[1,7],[1,8],[1,9],[5,6],[5,7],[5,8],[5,9],[6,7],[6,8],[6,9],[7,8],[7,9],[8,9] (15 combos)

    // Then Multiply all combinations together so we have every possible choice
    // T1S1, T1S6, T2S1, T2S2, T3S1, T3S5
    // etc
    // Total = 6 * 3 * 15 = 270

    // Finally you can do every selection of from seats with every selection of to seats = 720 * 270 = 194K combinations.
    // 6 Movements, 4 from broken table, 2 from a table with too many people.


    */

}

export const findTableById = (state: TournamentState, tableId: string): Table => {
    for(const table of state.tables) {
        if (table.id === tableId) {
            return table;
        }
    }
    throw new Error("Table not found with id:" + tableId);
}

export const findPlayerBySeat = (table: Table, seatId: number) => {
    for(const player of table.players) {
        if (player.seat === seatId) {
            return player;
        }
    }
    throw new Error("Player not found at seat:" + seatId + " of table " + table.id);
}

export const workOutTargetSeatPositions = (table: Table, sc: Array<number>): Array<TargetSeat> => {
    // Given that the following seats would be filled next round, work out the seating positions next round
    // Apply all existing players to seats

    const players = table.players.filter(p => p.participatingNextRound);
    const existingSeats = players.map(p => p.seat);
    for(let seat of sc) {
        if (existingSeats.indexOf(seat) !== -1) {
            throw new Error("Cannot place a player there, that seat is taken: " + seat);
        }
        players.push({
            name: 'New Player',
            id: 'x',
            participatingLastRound: false,
            participatingNextRound: true,
            seat: seat,
            movements: 0,
        });
    }

    // Sort players array by seat
    players.sort((a,b) => {
        return a.seat - b.seat;
    });

    // Work out where dealer button would be moving to
    let rotateBy = 1;
    for(let i=0; i<players.length; i++) {
        if (players[i].seat < table.dealerButtonLastRound) {
            rotateBy++;
        }
    }
    rotatePlayers(players, rotateBy);

    // Get all positions from dealer
    let positions = getPositionsForTableSize(players.length);

    let targetSeats: Array<TargetSeat> = [];
    for(let i=0; i<players.length; i++) {
        const player = players[i];
        if (player.id === "x") {
            targetSeats.push({
                tableId: table.id,
                seat: player.seat,
                position: positions[i],
            });
        }
    }
    return targetSeats;
}

export const convertSeatMovementToPlayerMovement = (state: TournamentState, sm: SeatMovement): PlayerMovement => {
    const table = findTableById(state, sm.fromSeatPosition.tableId);
    const player = findPlayerBySeat(table, sm.fromSeatPosition.seatId);

    return {
        fromTable: table,
        fromPlayer: player,
        to: sm.targetSeat,
        movementScore: sm.movementScore,
    }
}

export const getRebalancingPlayerMovements = (state: TournamentState): BalancingPlayersResult => {
    const result = getRebalancingMovements(state);

    // console.log("RESULT", JSON.stringify(result, null, 4));

    // PROCESS FROM SEAT POSITIONS
    for(const table of state.tables) {
        expandTablePositionsAsLastRound(table);
    }

    // console.log("TABLES", JSON.stringify(state, null, 4));

    // 1. Convert the fromSeats.selections seatIdList from Array<number> to Array<SeatPosition>
    const allSeatPositions: Array<SeatPositions> = [];
    for(const tableId in result.fromSeats.selections) {
        const table = findTableById(state, tableId);

        let seatsObj = {};
        for(const player of table.players) {
            if (player.participatingLastRound) {
                if (player.position) {
                    seatsObj[player.seat] = {
                        tableId: tableId,
                        seatId: player.seat,
                        position: player.position,
                        movements: player.movements,
                    }
                } else {
                    throw new Error("No position found for player that participated in last round table: " + tableId + " seat: " + player.seat);
                }
            }
        }

        const selectionTable = result.fromSeats.selections[tableId];
        const seatPosList: Array<SeatPosition> = selectionTable.seatIdList.map(seatId => {
            if (seatId in seatsObj) {
                return seatsObj[seatId];
            }
            throw new Error("Seat " + seatId + " not found on table " + tableId);
        });
        allSeatPositions.push({
            sps: seatPosList,
            chooseNumber: selectionTable.chooseNumber
        });

    }
    // console.log("SP", JSON.stringify(allSeatPositions, null, 4));

    let globalFromSeats = [];
    // 2. Choose each seatPositions and multiply them out with every selection (This will give every possible player selection choice)
    for(const sp of allSeatPositions) {
        const choices = combine(sp.sps, sp.chooseNumber).filter(p => p.length === sp.chooseNumber);
        globalFromSeats = multiplyArrays(globalFromSeats, choices);
    }

    // console.log("globalFromSeats", JSON.stringify(globalFromSeats, null, 4));


    // PROCESS TARGET SEAT POSITIONS

    let globalTargetSeats = [];
    // Now we need to expand the target seat combinations
    for(const sss of result.targetSeats) {

        let groupTargetSeats = [];

        for(const tableId in sss.selections) {
            const table = findTableById(state, tableId);
            const ss = sss.selections[tableId];

            const currentTargetSeats: Array<Array<TargetSeat>> = [];
            // Expand the combos of seats
            const seatCombos = combine(ss.seatIdList, ss.chooseNumber).filter(p => p.length === ss.chooseNumber);
            for(const sc of seatCombos) {
                // Where would the dealer be if these seats were taken next round?
                let targetSeats: Array<TargetSeat> = workOutTargetSeatPositions(table, sc);
                currentTargetSeats.push(targetSeats);
            }

            // At this point, multiply every currentTargetSeats in to globalTargetSeats???
            groupTargetSeats = multiplyArrays(groupTargetSeats, currentTargetSeats);
        }

        // Append these combos
        globalTargetSeats.push(...groupTargetSeats);
    }

    // console.log("globalTargetSeats", globalTargetSeats);

    // 3. Then we need to try every possible ordering of these players with every possible ordering of targets.
    // This is where we can be more efficient.  If the score has already gone above some threshold, we can rule out every combination below using recursion.
    // Keep track of the lowest score from and target selections.

    const optimalResult = getOptimalPlayerMovements(globalFromSeats, globalTargetSeats);
    // console.log("Final result", JSON.stringify(optimalResult, null, 4));

    // Convert the seatMovements in to playerMovements
    let playerMovements = [];
    let totalScore = 0;
    if (optimalResult !== null) {
        playerMovements = optimalResult.movements.map(sm => convertSeatMovementToPlayerMovement(state, sm));
        totalScore = optimalResult.totalScore;
    }

    return {
        movements: playerMovements,
        totalScore,
    }
}

export const multiplyArrays = (array1, array2) => {
    if (array1.length === 0) {
        return array2;
    } else {
        if (array2.length === 0) {
            return array1;
        }

        // For every item of array2, push it against every item of array 1
        let result = [];
        for (let array1Item of array1) {
            for (let array2Item of array2) {
                
                result.push([...array1Item, ...array2Item]);
            }
        }
        return result;
    }
}

