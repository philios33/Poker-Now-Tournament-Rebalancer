"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRebalancingPlayerMovements = exports.getRebalancingMovements = exports.getTablesWithHighestSize = exports.getTablesWithLowestSize = exports.getTablesWithLeastSizeAndMovements = exports.getTableSizeAndMovementsScore = exports.getActiveTablesNextRound = exports.getNumberOfPlayersNextRound = void 0;
var seatSelections_1 = __importDefault(require("../classes/seatSelections"));
var positions_1 = require("./positions");
var movement_1 = require("./movement");
var util_1 = require("./util");
var logger_1 = require("../classes/logger");
var noActiveTableError_1 = require("../classes/noActiveTableError");
var finalTableDetectedError_1 = require("../classes/finalTableDetectedError");
exports.getNumberOfPlayersNextRound = function (state) {
    var numberOfPlayers = 0;
    for (var _i = 0, _a = state.tables; _i < _a.length; _i++) {
        var table = _a[_i];
        numberOfPlayers += table.players.filter(function (p) { return p.participatingNextRound; }).length;
    }
    return numberOfPlayers;
};
exports.getActiveTablesNextRound = function (state) {
    return state.tables.filter(function (table) {
        var tablePlayersNextRound = table.players.filter(function (p) { return p.participatingNextRound; }).length;
        return tablePlayersNextRound > 0;
    });
};
var pokerNowMaxSeatId = 10;
var playerMovementsWeighting = 10;
// This means that 10 player movements is equivalent to 1 seated position
// A table with 5 players and zero total player movements will be chosen to break up over a table with only 4 players which have had 10 player movements already
exports.getTableSizeAndMovementsScore = function (table) {
    var score = 0;
    table.players.filter(function (p) { return p.participatingNextRound; }).map(function (player) {
        score += playerMovementsWeighting + player.movements; // Note, this should not be multiplication
        // The fact that a player exists (number of players) has more weighting than how often they have moved.
    });
    return score;
};
exports.getTablesWithLeastSizeAndMovements = function (tables, num) {
    // First score each table by number of players remaining and number of movements made already
    // So if it's a tie, the table with the players which have made the least number of existing table movements will be chosen to break up
    var orderedTables = tables.sort(function (a, b) {
        var scoreA = exports.getTableSizeAndMovementsScore(a);
        var scoreB = exports.getTableSizeAndMovementsScore(b);
        return scoreA - scoreB;
    });
    return orderedTables.slice(0, num);
};
exports.getTablesWithLowestSize = function (tables) {
    var lowestSize = 100;
    for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
        var table = tables_1[_i];
        var tableSize = table.players.filter(function (p) { return p.participatingNextRound; }).length;
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
    var toReturn = [];
    for (var _a = 0, tables_2 = tables; _a < tables_2.length; _a++) {
        var table = tables_2[_a];
        var tableSize = table.players.filter(function (p) { return p.participatingNextRound; }).length;
        if (typeof table.extraPlayers !== "undefined") {
            // Consider extra players assigned here
            tableSize += table.extraPlayers;
        }
        if (tableSize === lowestSize) {
            toReturn.push(table);
        }
    }
    return toReturn;
};
exports.getTablesWithHighestSize = function (tables) {
    //console.log("GETTING HIGHEST TABLE", JSON.stringify(tables, null, 4));
    var highestSize = 0;
    for (var _i = 0, tables_3 = tables; _i < tables_3.length; _i++) {
        var table = tables_3[_i];
        var tableSize = table.players.filter(function (p) { return p.participatingNextRound; }).length;
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
    var toReturn = [];
    for (var _a = 0, tables_4 = tables; _a < tables_4.length; _a++) {
        var table = tables_4[_a];
        var tableSize = table.players.filter(function (p) { return p.participatingNextRound; }).length;
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
};
exports.getRebalancingMovements = function (state) {
    util_1.doSanityChecksOnStateConfig(state.config);
    util_1.doSanityChecksOnStateTables(state.tables);
    var numberOfPlayersNextRound = exports.getNumberOfPlayersNextRound(state); // Only considers those player next round
    var optimalNumberOfTables = Math.ceil(numberOfPlayersNextRound / state.config.maxPlayersPerTable);
    var activeTablesNextRound = exports.getActiveTablesNextRound(state);
    var currentNumberOfTables = activeTablesNextRound.length; // We need to only consider tables with players playing next round
    if (currentNumberOfTables === 0) {
        throw new noActiveTableError_1.NoActiveTablesError();
    }
    else if (currentNumberOfTables === 1) {
        // Final table
        throw new finalTableDetectedError_1.FinalTableDetectedError(activeTablesNextRound[0]);
    }
    var breakWithLessThan = state.config.breakWithLessThan;
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
    var fromTableChoices = {
        choices: []
    };
    var toTableChoices = {
        choices: []
    };
    var totalNumberOfMovements = 0;
    var tableIdsBeingBrokenUp = [];
    if (optimalNumberOfTables < currentNumberOfTables) {
        var numberOfTablesToBreakUp = currentNumberOfTables - optimalNumberOfTables;
        // Break up the tables with the lowest number of people
        var tables = exports.getTablesWithLeastSizeAndMovements(activeTablesNextRound, numberOfTablesToBreakUp);
        for (var _i = 0, tables_5 = tables; _i < tables_5.length; _i++) {
            var table = tables_5[_i];
            // console.log("Breaking up table", table.id);
            var numActiveSeats = table.players.filter(function (p) { return p.participatingNextRound; }).length;
            if (breakWithLessThan > numActiveSeats) {
                // Move everyone
                for (var i = 0; i < numActiveSeats; i++) {
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
    var tablesAfter = [];
    for (var _a = 0, activeTablesNextRound_1 = activeTablesNextRound; _a < activeTablesNextRound_1.length; _a++) {
        var table = activeTablesNextRound_1[_a];
        if (tableIdsBeingBrokenUp.indexOf(table.id) === -1) {
            tablesAfter.push(table);
            table.extraPlayers = 0;
        }
    }
    // Work out the min and max players here based on tablesAfter.length
    var maxNumberOfPlayersOnTables = Math.ceil(numberOfPlayersNextRound / tablesAfter.length);
    var minNumberOfPlayersOnTables = maxNumberOfPlayersOnTables - 1;
    // Unless tables can be exactly balanced
    if ((maxNumberOfPlayersOnTables * tablesAfter.length) === numberOfPlayersNextRound) {
        minNumberOfPlayersOnTables = maxNumberOfPlayersOnTables;
    }
    var maxNumberOfPlayersOnTablesWithFlex = maxNumberOfPlayersOnTables + state.config.balanceMaxFlexibility;
    var minNumberOfPlayersOnTablesWithFlex = minNumberOfPlayersOnTables - state.config.balanceMinFlexibility;
    // Never lower the min sensitivity to less than 2
    minNumberOfPlayersOnTablesWithFlex = Math.max(minNumberOfPlayersOnTablesWithFlex, 2);
    // We also need to move those players on tables which now have too many or too few players
    // TODO Fix the problem where a tournament structure such as 5,10,10,10,10,10,10 would not get rebalanced because tables of 10 are allowed still.
    // We must consider tables with less than the minimum number of players
    // E.g. In this case in strict mode, 4 extra players should move so that 9,10,10,9,9,9,9 is made.
    // Check this later on.
    for (var _b = 0, activeTablesNextRound_2 = activeTablesNextRound; _b < activeTablesNextRound_2.length; _b++) {
        var table = activeTablesNextRound_2[_b];
        var playersParticipatingNextRound = table.players.filter(function (p) { return p.participatingNextRound; }).length;
        if (playersParticipatingNextRound > maxNumberOfPlayersOnTablesWithFlex) {
            var movementsFromTable = playersParticipatingNextRound - maxNumberOfPlayersOnTables;
            // console.log("Moving " + movementsFromTable + " players from table " + table.id);
            // fromSeats.add(table.id, table.players.filter(p => p.participatingNextRound).map(p => p.seat), movementsFromTable);
            for (var i = 0; i < movementsFromTable; i++) {
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
    var remainingMovements = totalNumberOfMovements;
    while (remainingMovements > 0) {
        // For each remaining movement, choose the active table with the least number of players.
        var lowestTables = exports.getTablesWithLowestSize(tablesAfter);
        // console.log(remainingMovements + " remaining.  Number of lowest tables is " + lowestTables.length);
        if (lowestTables.length <= remainingMovements) {
            // If there is a tie when assigning the next player to a table, just assign a player to each table.
            for (var _c = 0, lowestTables_1 = lowestTables; _c < lowestTables_1.length; _c++) {
                var table = lowestTables_1[_c];
                table.extraPlayers++; // Signifys that this table will receive a new player
                toTableChoices.choices.push({
                    tableIdList: [table.id],
                    choose: 1,
                });
                remainingMovements--;
            }
        }
        else {
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
    for (var _d = 0, activeTablesNextRound_3 = activeTablesNextRound; _d < activeTablesNextRound_3.length; _d++) {
        var table = activeTablesNextRound_3[_d];
        if (tableIdsBeingBrokenUp.indexOf(table.id) === -1) {
            var playersParticipatingNextRound = table.players.filter(function (p) { return p.participatingNextRound; }).length + (table.extraPlayers ? table.extraPlayers : 0);
            if (playersParticipatingNextRound < minNumberOfPlayersOnTablesWithFlex) {
                var numberOfMovementsTo = (minNumberOfPlayersOnTables - playersParticipatingNextRound);
                for (var i = 0; i < numberOfMovementsTo; i++) {
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
            var highestTables = exports.getTablesWithHighestSize(tablesAfter); // This honours the extraPlayers count on the table
            if (highestTables.length <= remainingMovements) {
                for (var i = 0; i < highestTables.length; i++) {
                    fromTableChoices.choices.push({
                        tableIdList: [highestTables[i].id],
                        choose: 1,
                    });
                    highestTables[i].extraPlayers--; // Signifys that this table will have a player removed
                    remainingMovements++;
                }
            }
            else {
                // There are too many tables to choose from, this is the final one
                fromTableChoices.choices.push({
                    tableIdList: highestTables.map(function (t) { return t.id; }),
                    choose: -remainingMovements,
                });
                remainingMovements = 0; // Final movement
            }
        }
    }
    else if (remainingMovements > 0) {
        // We still have some players to assign
        while (remainingMovements > 0) {
            var lowestTables = exports.getTablesWithLowestSize(tablesAfter);
            if (lowestTables.length < remainingMovements) {
                // Assign to all lowest tables
                for (var _e = 0, lowestTables_2 = lowestTables; _e < lowestTables_2.length; _e++) {
                    var table = lowestTables_2[_e];
                    table.extraPlayers++;
                    toTableChoices.choices.push({
                        tableIdList: [table.id],
                        choose: 1,
                    });
                    remainingMovements--;
                }
            }
            else {
                toTableChoices.choices.push({
                    tableIdList: lowestTables.map(function (t) { return t.id; }),
                    choose: remainingMovements,
                });
                remainingMovements = 0;
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
    var fromSeats = new seatSelections_1.default();
    for (var _f = 0, _g = fromTableChoices.choices; _f < _g.length; _f++) {
        var tableChoice = _g[_f];
        if (tableChoice.choose < tableChoice.tableIdList.length) {
            // Randomly choose table selection
            var tableIdList = util_1.randomlyChooseTables(tableChoice.tableIdList, tableChoice.choose); // Note: This choose value should never be higher than the number of table ids
            for (var _h = 0, tableIdList_1 = tableIdList; _h < tableIdList_1.length; _h++) {
                var tableId = tableIdList_1[_h];
                fromSeats.add(tableId, util_1.getSeatListOfActivePlayers(tableId, state), 1);
            }
        }
        else {
            for (var _j = 0, _k = tableChoice.tableIdList; _j < _k.length; _j++) {
                var tableId = _k[_j];
                fromSeats.add(tableId, util_1.getSeatListOfActivePlayers(tableId, state), 1);
            }
        }
    }
    // We may have choices still in the targetSeats, so these need to be expanded in to an array
    var targetSeats = [new seatSelections_1.default()];
    for (var _l = 0, _m = toTableChoices.choices; _l < _m.length; _l++) {
        var tableChoice = _m[_l];
        if (tableChoice.choose === 1 && tableChoice.tableIdList.length === 1) {
            // Normal target seat, add to all
            for (var _o = 0, targetSeats_1 = targetSeats; _o < targetSeats_1.length; _o++) {
                var toSeats = targetSeats_1[_o];
                toSeats.add(tableChoice.tableIdList[0], util_1.invertSeatList(util_1.getSeatListOfActivePlayers(tableChoice.tableIdList[0], state), pokerNowMaxSeatId), 1);
            }
        }
        else {
            // Choice target seat, multiply by all the current targetSeats
            var tableCombinations = util_1.getTableIdCombinations(tableChoice.tableIdList, tableChoice.choose);
            // console.log("Remaining movements", remainingMovements);
            // console.log("Table Combos", JSON.stringify(tableCombinations, null, 4));
            var newTargetSeats = [];
            for (var _p = 0, tableCombinations_1 = tableCombinations; _p < tableCombinations_1.length; _p++) {
                var tableCombo = tableCombinations_1[_p];
                // Expand these table combinations in to the existing targetSeats
                for (var _q = 0, targetSeats_2 = targetSeats; _q < targetSeats_2.length; _q++) {
                    var targetSeat = targetSeats_2[_q];
                    var anotherSeatSelections = new seatSelections_1.default(targetSeat);
                    for (var _r = 0, tableCombo_1 = tableCombo; _r < tableCombo_1.length; _r++) {
                        var tableId = tableCombo_1[_r];
                        anotherSeatSelections.add(tableId, util_1.invertSeatList(util_1.getSeatListOfActivePlayers(tableId, state), pokerNowMaxSeatId), 1);
                    }
                    // console.log("anotherSeatSelections", anotherSeatSelections);
                    newTargetSeats.push(anotherSeatSelections);
                }
            }
            targetSeats = newTargetSeats;
        }
    }
    // console.log("From Seats", JSON.stringify(fromSeats, null, 4));
    // console.log("Target Seats", JSON.stringify(targetSeats, null, 4));
    return {
        movements: totalNumberOfMovements,
        fromSeats: fromSeats,
        targetSeats: targetSeats,
        stats: {
            currentNumberOfTables: currentNumberOfTables,
            maxNumberOfPlayersOnTables: maxNumberOfPlayersOnTables,
            numberOfPlayersNextRound: numberOfPlayersNextRound,
            optimalNumberOfTables: optimalNumberOfTables,
            tableIdsBeingBrokenUp: tableIdsBeingBrokenUp,
        }
    };
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
};
exports.getRebalancingPlayerMovements = function (state) {
    var startTime = (new Date()).getTime();
    var logger = new logger_1.Logger(false, "Start");
    var result = exports.getRebalancingMovements(state);
    logger.log("Got Rebalancing Movements");
    // console.log("RESULT", JSON.stringify(result, null, 4));
    // PROCESS FROM SEAT POSITIONS
    for (var _i = 0, _a = state.tables; _i < _a.length; _i++) {
        var table = _a[_i];
        positions_1.expandTablePositionsAsLastRound(table);
    }
    logger.log("Expanded Table Positions At Last Round");
    // console.log("TABLES", JSON.stringify(state, null, 4));
    // 1. Convert the fromSeats.selections seatIdList from Array<number> to Array<SeatPosition>
    var allSeatPositions = [];
    var _loop_1 = function (tableId) {
        var table = util_1.findTableById(state, tableId);
        // Find number of players last round
        var numOfPlayers = table.players.filter(function (p) { return p.participatingLastRound; }).length;
        var seatsObj = {};
        for (var _i = 0, _a = table.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.participatingLastRound) {
                if (player.position) {
                    seatsObj[player.seat] = {
                        tableId: tableId,
                        seatId: player.seat,
                        position: player.position,
                        movements: player.movements,
                        numOfPlayers: numOfPlayers,
                    };
                }
                else {
                    throw new Error("No position found for player that participated in last round table: " + tableId + " seat: " + player.seat);
                }
            }
        }
        var selectionTable = result.fromSeats.selections[tableId];
        var seatPosList = selectionTable.seatIdList.map(function (seatId) {
            if (seatId in seatsObj) {
                return seatsObj[seatId];
            }
            throw new Error("Seat " + seatId + " not found on table " + tableId);
        });
        allSeatPositions.push({
            sps: seatPosList,
            chooseNumber: selectionTable.chooseNumber
        });
    };
    for (var tableId in result.fromSeats.selections) {
        _loop_1(tableId);
    }
    logger.log("All From Seat Positions Worked Out");
    // console.log("SP", JSON.stringify(allSeatPositions, null, 4));
    var globalFromSeats = [];
    var _loop_2 = function (sp) {
        var choices = util_1.combine(sp.sps, sp.chooseNumber).filter(function (p) { return p.length === sp.chooseNumber; });
        globalFromSeats = util_1.multiplyArrays(globalFromSeats, choices);
    };
    // 2. Choose each seatPositions and multiply them out with every selection (This will give every possible player selection choice)
    for (var _b = 0, allSeatPositions_1 = allSeatPositions; _b < allSeatPositions_1.length; _b++) {
        var sp = allSeatPositions_1[_b];
        _loop_2(sp);
    }
    logger.log("Expanded Global From Seats");
    // console.log("globalFromSeats", JSON.stringify(globalFromSeats, null, 4));
    // PROCESS TARGET SEAT POSITIONS
    var globalTargetSeats = [];
    // Now we need to expand the target seat combinations
    for (var _c = 0, _d = result.targetSeats; _c < _d.length; _c++) {
        var sss = _d[_c];
        var groupTargetSeats = [];
        var _loop_3 = function (tableId) {
            var table = util_1.findTableById(state, tableId);
            var ss = sss.selections[tableId];
            var currentTargetSeats = [];
            // Expand the combos of seats
            var seatCombos = util_1.combine(ss.seatIdList, ss.chooseNumber).filter(function (p) { return p.length === ss.chooseNumber; });
            for (var _i = 0, seatCombos_1 = seatCombos; _i < seatCombos_1.length; _i++) {
                var sc = seatCombos_1[_i];
                // Where would the dealer be if these seats were taken next round?
                var targetSeats = util_1.workOutTargetSeatPositions(table, sc);
                currentTargetSeats.push(targetSeats);
            }
            // At this point, multiply every currentTargetSeats in to globalTargetSeats???
            groupTargetSeats = util_1.multiplyArrays(groupTargetSeats, currentTargetSeats);
        };
        for (var tableId in sss.selections) {
            _loop_3(tableId);
        }
        // Append these combos
        globalTargetSeats.push.apply(globalTargetSeats, groupTargetSeats);
    }
    logger.log("Expanded Global Target Seats");
    // console.log("globalTargetSeats", globalTargetSeats);
    // 3. Then we need to try every possible ordering of these players with every possible ordering of targets.
    // This is where we can be more efficient.  If the score has already gone above some threshold, we can rule out every combination below using recursion.
    // Keep track of the lowest score from and target selections.
    // We want to count the combos in all of the ArrayArrays.
    var fromCombos = 0;
    for (var _e = 0, globalFromSeats_1 = globalFromSeats; _e < globalFromSeats_1.length; _e++) {
        var fsArray = globalFromSeats_1[_e];
        fromCombos += fsArray.length;
    }
    var targetCombos = 0;
    for (var _f = 0, globalTargetSeats_1 = globalTargetSeats; _f < globalTargetSeats_1.length; _f++) {
        var tsArray = globalTargetSeats_1[_f];
        targetCombos += tsArray.length;
    }
    if (globalFromSeats.length === 0) {
        // No movements necessary
        logger.log("Finished");
        var endTime_1 = (new Date()).getTime();
        return {
            stats: result.stats,
            movements: [],
            movementsText: "No movements",
            totalScore: 0,
            optimalResult: null,
            msTaken: endTime_1 - startTime,
        };
    }
    // console.log("Global From Seats", globalFromSeats.length + " groups with a total of " + fromCombos + " combinations");
    // console.log("Global Target Seats", globalTargetSeats.length + " groups with a total of " + targetCombos + " combinations");
    var optimalResult = movement_1.getOptimalPlayerMovements(globalFromSeats, globalTargetSeats);
    logger.log("Obtained Optimal Player Movements");
    // console.log("Final result", JSON.stringify(optimalResult, null, 4));
    if (optimalResult.bestResult === null) {
        throw new Error("Could not find the optimal player movements for this scenario");
    }
    // Convert the seatMovements in to playerMovements
    var playerMovements = [];
    var totalScore = 0;
    if (optimalResult !== null) {
        playerMovements = optimalResult.bestResult.movements.map(function (sm) { return util_1.convertSeatMovementToPlayerMovement(state, sm); });
        totalScore = optimalResult.bestResult.totalScore;
    }
    logger.log("Finished");
    var endTime = (new Date()).getTime();
    // console.log("optimalResult", "score", optimalResult.bestResult.totalScore, "tried all combos", optimalResult.triedAllCombinations, "processed combos", optimalResult.processedCombinations, "of", optimalResult.totalCombinations, "movements checked", optimalResult.totalMovementsChecked, "movements skipped", optimalResult.totalMovementsSkipped, "msTook", endTime - startTime);
    return {
        stats: result.stats,
        movements: playerMovements,
        movementsText: util_1.convertMovementsToText(playerMovements),
        totalScore: totalScore,
        optimalResult: optimalResult,
        /*
        totalCombinations: optimalResult.totalCombinations,
        processedCombinations: optimalResult.processedCombinations,
        totalMovementsChecked: optimalResult.totalMovementsChecked,
        totalMovementsSkipped: optimalResult.totalMovementsSkipped,
        */
        msTaken: endTime - startTime,
    };
};
//# sourceMappingURL=balancer.js.map