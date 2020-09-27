
import { TournamentState } from "../types/tournamentState"
import { Table } from "../types/table";
import SeatSelections from "../classes/seatSelections";
import { BalancingMovementsResult } from "../types/balancingMovementsResult";
import { expandTablePositionsAsLastRound } from "./positions";
import { TargetSeat } from "../types/targetSeat";
import { SeatPosition } from "../types/seatPosition";
import { SeatPositions } from "../types/seatPositions";
import { getOptimalPlayerMovements } from "./movement";
import { BalancingPlayersResult } from "../types/balancingPlayersResult";
import { invertSeatList, findTableById, combine, multiplyArrays, convertSeatMovementToPlayerMovement, randomlyChooseTables, getTableIdCombinations, getSeatListOfActivePlayers, workOutTargetSeatPositions, convertMovementsToText } from "./util";
import { Logger } from "../classes/logger";
import { TableChoices } from "../types/tableChoices";



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
        score += playerMovementsWeighting + player.movements // Note, this should not be multiplication
        // The fact that a player exists (number of players) has more weighting than how often they have moved.
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

export const getTablesWithLowestSize = (tables: Array<Table>): Array<Table> => {
    let lowestSize = 100;
    for(const table of tables) {
        let tableSize = table.players.filter(p => p.participatingNextRound).length;
        if (typeof table.extraPlayers !== "undefined") {
            // Consider extra players assigned here
            tableSize += table.extraPlayers;
        }
        // console.log(table.id + " has size of " + tableSize);
        if (tableSize < lowestSize) {
            lowestSize = tableSize;
        }
    }
    // console.log("Lowest size is: " + lowestSize);
    // Then return all tables with this size
    const toReturn: Array<Table> = [];
    for(const table of tables) {
        let tableSize = table.players.filter(p => p.participatingNextRound).length;
        if (typeof table.extraPlayers !== "undefined") {
            // Consider extra players assigned here
            tableSize += table.extraPlayers;
        }
        if (tableSize === lowestSize) {
            toReturn.push(table);
        }
    }
    return toReturn;
}

export const getTablesWithHighestSize = (tables: Array<Table>): Array<Table> => {
    //console.log("GETTING HIGHEST TABLE", JSON.stringify(tables, null, 4));
    let highestSize = 0;
    for(const table of tables) {
        let tableSize = table.players.filter(p => p.participatingNextRound).length;
        if (typeof table.extraPlayers !== "undefined") {
            // Consider extra players assigned here
            tableSize += table.extraPlayers;
        }
        // console.log(table.id + " has size of " + tableSize);
        if (tableSize > highestSize) {
            highestSize = tableSize;
        }
    }
    // console.log("Highest size is: " + highestSize);
    // Then return all tables with this size
    const toReturn: Array<Table> = [];
    for(const table of tables) {
        let tableSize = table.players.filter(p => p.participatingNextRound).length;
        if (typeof table.extraPlayers !== "undefined") {
            // Consider extra players assigned here
            tableSize += table.extraPlayers;
        }
        if (tableSize === highestSize) {
            toReturn.push(table);
        }
    }
    // console.log("RETURNING", toReturn);
    return toReturn;
}

export const getRebalancingMovements = (state: TournamentState): BalancingMovementsResult => {

    let numberOfPlayersNextRound = getNumberOfPlayersNextRound(state);
    let optimalNumberOfTables = Math.ceil(numberOfPlayersNextRound / state.config.maxPlayersPerTable);
    let currentNumberOfTables = state.tables.length;

    let breakWithLessThan = state.config.breakWithLessThan;
    breakWithLessThan = Math.max(breakWithLessThan, 2);

    /*
    console.log("numberOfPlayersNextRound = " + numberOfPlayersNextRound);
    console.log("optimalNumberOfTables = " + optimalNumberOfTables);
    console.log("currentNumberOfTables = " + currentNumberOfTables);
    console.log("maxNumberOfPlayersOnTables = " + maxNumberOfPlayersOnTables);
    */

    // First just work out the FROM tableChoices and TO tableChoices.
    // These determine which tables have moving players.  Nothing to do with seats.

    // I want to phase out SeatSelections class.  It seems to be irrelevant now.
    // let fromSeats = new SeatSelections();
    // And replace it with this.
    let fromTableChoices: TableChoices = {
        choices: []
    };
    let toTableChoices: TableChoices = {
        choices: []
    };

    let totalNumberOfMovements = 0;

    let tableIdsBeingBrokenUp = [];

    if (optimalNumberOfTables < currentNumberOfTables) {
        let numberOfTablesToBreakUp = currentNumberOfTables - optimalNumberOfTables;

        // Break up the tables with the lowest number of people
        let tables = getTablesWithLeastSizeAndMovements(state, numberOfTablesToBreakUp);
        for (let table of tables) {
            // console.log("Breaking up table", table.id);
            let numActiveSeats = table.players.filter(p => p.participatingNextRound).length;

            if (breakWithLessThan > numActiveSeats) {
                // Move everyone
                for(let i=0; i<numActiveSeats; i++) {
                    fromTableChoices.choices.push({
                        tableIdList: [table.id],
                        choose: 1,
                    });
                    totalNumberOfMovements++;
                }
                
                // fromSeats.add(table.id, activeSeats, activeSeats.length); // Move everyone
                
                // Remove from tableSizes counter object
                tableIdsBeingBrokenUp.push(table.id);
            }
        }
    }

    tableIdsBeingBrokenUp.sort(); // Just alphabetically sort

    let tablesAfter = []
    for(let table of state.tables) {
        if (tableIdsBeingBrokenUp.indexOf(table.id) === -1) {
            tablesAfter.push(table);
            table.extraPlayers = 0;
        }
    }

    // Work out the min and max players here based on tablesAfter.length
    let maxNumberOfPlayersOnTables = Math.ceil(numberOfPlayersNextRound / tablesAfter.length);
    let minNumberOfPlayersOnTables = maxNumberOfPlayersOnTables - 1;
    // Unless tables can be exactly balanced
    if ((maxNumberOfPlayersOnTables * tablesAfter.length) === numberOfPlayersNextRound) {
        minNumberOfPlayersOnTables = maxNumberOfPlayersOnTables;
    }
    
    let maxNumberOfPlayersOnTablesWithFlex = maxNumberOfPlayersOnTables + state.config.balanceMaxFlexibility;
    let minNumberOfPlayersOnTablesWithFlex = minNumberOfPlayersOnTables - state.config.balanceMinFlexibility;

    // Never lower the min sensitivity to less than 2
    minNumberOfPlayersOnTablesWithFlex = Math.max(minNumberOfPlayersOnTablesWithFlex, 2);


    // We also need to move those players on tables which now have too many or too few players
    
    // TODO Fix the problem where a tournament structure such as 5,10,10,10,10,10,10 would not get rebalanced because tables of 10 are allowed still.
    // We must consider tables with less than the minimum number of players
    // E.g. In this case in strict mode, 4 extra players should move so that 9,10,10,9,9,9,9 is made.
    // Check this later on.

    for(let table of state.tables) {
        const playersParticipatingNextRound = table.players.filter(p => p.participatingNextRound).length;
        if (playersParticipatingNextRound > maxNumberOfPlayersOnTablesWithFlex) {
            const movementsFromTable = playersParticipatingNextRound - maxNumberOfPlayersOnTables;
            // console.log("Moving " + movementsFromTable + " players from table " + table.id);
            // fromSeats.add(table.id, table.players.filter(p => p.participatingNextRound).map(p => p.seat), movementsFromTable);
            for(let i=0; i<movementsFromTable; i++) {
                fromTableChoices.choices.push({
                    tableIdList: [table.id],
                    choose: 1,
                });
                totalNumberOfMovements++;
            }
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

    // Here we decide where the players should go.
    let remainingMovements = totalNumberOfMovements;
    while (remainingMovements > 0) {
        // For each remaining movement, choose the active table with the least number of players.
        let lowestTables = getTablesWithLowestSize(tablesAfter);
        // console.log(remainingMovements + " remaining.  Number of lowest tables is " + lowestTables.length);
        if (lowestTables.length <= remainingMovements) {
            // If there is a tie when assigning the next player to a table, just assign a player to each table.
            for(const table of lowestTables) {
                table.extraPlayers++; // Signifys that this table will receive a new player
                
                toTableChoices.choices.push({
                    tableIdList: [table.id],
                    choose: 1,
                });
                remainingMovements--;
            }
        } else {
            // So there are some remainingMovements still, but there is a tie and not enough lowestTables to choose from.
            // We need to fork the SeatSelections object for each combination
            // console.log("There are " + remainingMovements + " still to assign but " + lowestTables.length + " to choose from");
            break;
        }
    }

    // console.log("tablesAfter is", tablesAfter);
    // Make the primary SeatSelections
    // This has been replaced by toTableChoices
    /*
    let toSeats: SeatSelections = new SeatSelections();
    for(const table of tablesAfter) {
        if (table.extraPlayers > 0) {
            toSeats.add(table.id, invertSeatList(table.players.filter(p => p.participatingNextRound).map(p => p.seat), pokerNowMaxSeatId), table.extraPlayers);
        }
    }
    */

    // At this point, we need to look at which tables are too low on numbers.
    // We first work out how many extra movements are needed.
    // let totalNumberOfExtraMovements = 0;
    for(let table of state.tables) {
        if (tableIdsBeingBrokenUp.indexOf(table.id) === -1) {
            const playersParticipatingNextRound = table.players.filter(p => p.participatingNextRound).length + (table.extraPlayers ? table.extraPlayers : 0);
            if (playersParticipatingNextRound < minNumberOfPlayersOnTablesWithFlex) {
                const numberOfMovementsTo = (minNumberOfPlayersOnTables - playersParticipatingNextRound);
                for(let i=0; i<numberOfMovementsTo; i++) {
                    table.extraPlayers++;
                    toTableChoices.choices.push({
                        tableIdList: [table.id],
                        choose: 1,
                    });
                    remainingMovements--;
                }
            }
        }
    }
    // If the remainingMovements is now negative, it means we have assigned too many target seats and need to pull extra players from the highest tables

    if (remainingMovements < 0) {
        // console.log("Extra players to grab", -remainingMovements);
        
        while (remainingMovements < 0) {
            // Find highest table
            let highestTables = getTablesWithHighestSize(tablesAfter);  // This honours the extraPlayers count on the table
            if (highestTables.length <= remainingMovements) {
                for(let i=0; i<highestTables.length; i++) {
                    fromTableChoices.choices.push({
                        tableIdList: [highestTables[i].id],
                        choose: 1,
                    });
                    highestTables[i].extraPlayers--; // Signifys that this table will have a player removed
                    remainingMovements++;
                }
            } else {
                // There are too many tables to choose from, this is the final one
                fromTableChoices.choices.push({
                    tableIdList: highestTables.map(t => t.id),
                    choose: -remainingMovements,
                });
                remainingMovements=0; // Final movement
            }
        }
    } else if (remainingMovements > 0) {
        // We still have some players to assign
        while (remainingMovements > 0) {
            let lowestTables = getTablesWithLowestSize(tablesAfter);

            if (lowestTables.length < remainingMovements) {
                // Assign to all lowest tables
                for(const table of lowestTables) {
                    table.extraPlayers++;
                    toTableChoices.choices.push({
                        tableIdList: [table.id],
                        choose: 1,
                    });
                    remainingMovements--;
                }
            } else {
                toTableChoices.choices.push({
                    tableIdList: lowestTables.map(t => t.id),
                    choose: remainingMovements,
                });
                remainingMovements=0;
            }
        }
    }

    /*
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
                anotherSeatSelections.add(table.id, invertSeatList(table.players.filter(p => p.participatingNextRound).map(p => p.seat), pokerNowMaxSeatId), 1);
            }
            // console.log("anotherSeatSelections", anotherSeatSelections);
            targetSeats.push(anotherSeatSelections);
        }
    } else {
        targetSeats.push(toSeats);
    }
    */

    // We just need to convert fromTableChoices(TableChoices) and toTableChoices(TableChoices) combinations to fromSeats(SeatSelections) and targetSeats(Array<SeatSelections>)
    // console.log("FROM CHOICES", JSON.stringify(fromTableChoices, null, 4));
    // console.log("TO CHOICES", JSON.stringify(toTableChoices, null, 4));

    // We must have a distinct set of fromSeats, so having any choices here will need to be randomly expanded.
    let fromSeats = new SeatSelections();
    for(const tableChoice of fromTableChoices.choices) {
        if (tableChoice.choose < tableChoice.tableIdList.length) {
            // Randomly choose table selection
            const tableIdList = randomlyChooseTables(tableChoice.tableIdList, tableChoice.choose); // Note: This choose value should never be higher than the number of table ids
            for (const tableId of tableIdList) {
                fromSeats.add(tableId, getSeatListOfActivePlayers(tableId, state), 1);
            }
        } else {
            for (const tableId of tableChoice.tableIdList) {
                fromSeats.add(tableId, getSeatListOfActivePlayers(tableId, state), 1);
            }
        }
    }

    // We may have choices still in the targetSeats, so these need to be expanded in to an array
    let targetSeats = [new SeatSelections()];

    for(const tableChoice of toTableChoices.choices) {
        if (tableChoice.choose === 1 && tableChoice.tableIdList.length === 1) {
            // Normal target seat, add to all
            for(const toSeats of targetSeats) {
                toSeats.add(tableChoice.tableIdList[0], invertSeatList(getSeatListOfActivePlayers(tableChoice.tableIdList[0], state), pokerNowMaxSeatId), 1);
            }
        } else {
            // Choice target seat, multiply by all the current targetSeats

            let tableCombinations: Array<Array<string>> = getTableIdCombinations(tableChoice.tableIdList, tableChoice.choose);

            // console.log("Remaining movements", remainingMovements);
            // console.log("Table Combos", JSON.stringify(tableCombinations, null, 4));

            let newTargetSeats = [];
            for(const tableCombo of tableCombinations) {
                // Expand these table combinations in to the existing targetSeats
                for(const targetSeat of targetSeats) {
                    let anotherSeatSelections = new SeatSelections(targetSeat);
                    for(const tableId of tableCombo) {
                        anotherSeatSelections.add(tableId, invertSeatList(getSeatListOfActivePlayers(tableId, state), pokerNowMaxSeatId), 1);
                    }
                    // console.log("anotherSeatSelections", anotherSeatSelections);
                    newTargetSeats.push(anotherSeatSelections);
                }
            }
            targetSeats = newTargetSeats
        }
    }

    // console.log("From Seats", JSON.stringify(fromSeats, null, 4));
    // console.log("Target Seats", JSON.stringify(targetSeats, null, 4));

    return {
        movements: totalNumberOfMovements,
        fromSeats,
        targetSeats,
        stats: {
            currentNumberOfTables,
            maxNumberOfPlayersOnTables,
            numberOfPlayersNextRound,
            optimalNumberOfTables,
            tableIdsBeingBrokenUp,
        }
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







export const getRebalancingPlayerMovements = (state: TournamentState): BalancingPlayersResult => {
    const startTime = (new Date()).getTime();
    const logger = new Logger(false, "Start");
    const result = getRebalancingMovements(state);
    logger.log("Got Rebalancing Movements");
    // console.log("RESULT", JSON.stringify(result, null, 4));

    // PROCESS FROM SEAT POSITIONS
    for(const table of state.tables) {
        expandTablePositionsAsLastRound(table);
    }
    logger.log("Expanded Table Positions At Last Round");
    // console.log("TABLES", JSON.stringify(state, null, 4));

    // 1. Convert the fromSeats.selections seatIdList from Array<number> to Array<SeatPosition>
    const allSeatPositions: Array<SeatPositions> = [];
    for(const tableId in result.fromSeats.selections) {
        const table = findTableById(state, tableId);

        // Find number of players last round
        const numOfPlayers = table.players.filter(p => p.participatingLastRound).length

        let seatsObj: { [key: string]: SeatPosition } = {};
        for(const player of table.players) {
            if (player.participatingLastRound) {
                if (player.position) {
                    seatsObj[player.seat] = {
                        tableId: tableId,
                        seatId: player.seat,
                        position: player.position,
                        movements: player.movements,
                        numOfPlayers: numOfPlayers,
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
    logger.log("All From Seat Positions Worked Out");
    // console.log("SP", JSON.stringify(allSeatPositions, null, 4));

    let globalFromSeats = [];
    // 2. Choose each seatPositions and multiply them out with every selection (This will give every possible player selection choice)
    for(const sp of allSeatPositions) {
        const choices = combine(sp.sps, sp.chooseNumber).filter(p => p.length === sp.chooseNumber);
        globalFromSeats = multiplyArrays(globalFromSeats, choices);
    }

    logger.log("Expanded Global From Seats");
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
    logger.log("Expanded Global Target Seats");

    // console.log("globalTargetSeats", globalTargetSeats);

    // 3. Then we need to try every possible ordering of these players with every possible ordering of targets.
    // This is where we can be more efficient.  If the score has already gone above some threshold, we can rule out every combination below using recursion.
    // Keep track of the lowest score from and target selections.

    // We want to count the combos in all of the ArrayArrays.
    let fromCombos = 0;
    for(const fsArray of globalFromSeats) {
        fromCombos += fsArray.length;
    }

    let targetCombos = 0;
    for(const tsArray of globalTargetSeats) {
        targetCombos += tsArray.length;
    }

    if (globalFromSeats.length === 0) {
        // No movements necessary
        logger.log("Finished");
        const endTime = (new Date()).getTime();

        return {
            stats: result.stats,
            movements: [],
            movementsText: "No movements",
            totalScore: 0,
            optimalResult: null,
            msTaken: endTime - startTime,    
        }
    }

    // console.log("Global From Seats", globalFromSeats.length + " groups with a total of " + fromCombos + " combinations");
    // console.log("Global Target Seats", globalTargetSeats.length + " groups with a total of " + targetCombos + " combinations");

    const optimalResult = getOptimalPlayerMovements(globalFromSeats, globalTargetSeats);
    logger.log("Obtained Optimal Player Movements");
    
    // console.log("Final result", JSON.stringify(optimalResult, null, 4));
    if (optimalResult.bestResult === null) {
        throw new Error("Could not find the optimal player movements for this scenario");
    }

    // Convert the seatMovements in to playerMovements
    let playerMovements = [];
    let totalScore = 0;
    if (optimalResult !== null) {
        playerMovements = optimalResult.bestResult.movements.map(sm => convertSeatMovementToPlayerMovement(state, sm));
        totalScore = optimalResult.bestResult.totalScore;
    }

    logger.log("Finished");
    const endTime = (new Date()).getTime();

    // console.log("optimalResult", optimalResult, "score", optimalResult.bestResult.totalScore);

    return {
        stats: result.stats,
        movements: playerMovements,
        movementsText: convertMovementsToText(playerMovements),
        totalScore,

        optimalResult,
        /*
        totalCombinations: optimalResult.totalCombinations,
        processedCombinations: optimalResult.processedCombinations,
        totalMovementsChecked: optimalResult.totalMovementsChecked,
        totalMovementsSkipped: optimalResult.totalMovementsSkipped,
        */
        
        msTaken: endTime - startTime,
        
    }
}



