"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRebalancingPlayerMovements = exports.workOutTargetSeatPositions = exports.getRebalancingMovements = exports.getTablesWithLowestSize = exports.getTablesWithLeastSizeAndMovements = exports.getTableSizeAndMovementsScore = exports.getNumberOfPlayersNextRound = void 0;
var seatSelections_1 = __importDefault(require("../classes/seatSelections"));
var positions_1 = require("./positions");
var movement_1 = require("./movement");
var util_1 = require("./util");
exports.getNumberOfPlayersNextRound = function (state) {
    var numberOfPlayers = 0;
    for (var _i = 0, _a = state.tables; _i < _a.length; _i++) {
        var table = _a[_i];
        numberOfPlayers += table.players.filter(function (p) { return p.participatingNextRound; }).length;
    }
    return numberOfPlayers;
};
var pokerNowMaxSeatId = 10;
var playerMovementsWeighting = 10;
// This means that 10 player movements is equivalent to 1 seated position
// A table with 5 players and zero total player movements will be chosen to break up over a table with only 4 players which have had 10 player movements already
exports.getTableSizeAndMovementsScore = function (table) {
    var score = 0;
    table.players.filter(function (p) { return p.participatingNextRound; }).map(function (player) {
        score += playerMovementsWeighting + player.movements;
    });
    return score;
};
exports.getTablesWithLeastSizeAndMovements = function (state, num) {
    // First score each table by number of players remaining and number of movements made already
    // So if it's a tie, the table with the players which have made the least number of existing table movements will be chosen to break up
    var orderedTables = state.tables.sort(function (a, b) {
        var scoreA = exports.getTableSizeAndMovementsScore(a);
        var scoreB = exports.getTableSizeAndMovementsScore(b);
        return scoreA - scoreB;
    });
    return orderedTables.slice(0, num);
};
/*
const getAllPlayersInNextRound = (tables: Array<Table>): Array<Player> => {
    const all = [];
    for(const table of tables) {
        all.push(...table.players.filter(p => p.participatingNextRound));
    }
    return all;
}
*/
exports.getTablesWithLowestSize = function (tables) {
    var lowestSize = 100;
    for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
        var table = tables_1[_i];
        var tableSize = table.players.filter(function (p) { return p.participatingNextRound; }).length + table.extraPlayers; // Consider extra players assigned here
        if (tableSize < lowestSize) {
            lowestSize = tableSize;
        }
    }
    // Then return all tables with this size
    var toReturn = [];
    for (var _a = 0, tables_2 = tables; _a < tables_2.length; _a++) {
        var table = tables_2[_a];
        var tableSize = table.players.filter(function (p) { return p.participatingNextRound; }).length + table.extraPlayers; // Consider extra players assigned here
        if (tableSize === lowestSize) {
            toReturn.push(table);
        }
    }
    return toReturn;
};
exports.getRebalancingMovements = function (state) {
    var numberOfPlayersNextRound = exports.getNumberOfPlayersNextRound(state);
    var optimalNumberOfTables = Math.ceil(numberOfPlayersNextRound / state.config.maxPlayersPerTable);
    var currentNumberOfTables = state.tables.length;
    var maxNumberOfPlayersOnTables = Math.ceil(numberOfPlayersNextRound / optimalNumberOfTables);
    console.log("numberOfPlayersNextRound = " + numberOfPlayersNextRound);
    console.log("optimalNumberOfTables = " + optimalNumberOfTables);
    console.log("currentNumberOfTables = " + currentNumberOfTables);
    console.log("maxNumberOfPlayersOnTables = " + maxNumberOfPlayersOnTables);
    var fromSeats = new seatSelections_1.default();
    var totalNumberOfMovements = 0;
    var tableIdsBeingBrokenUp = [];
    if (optimalNumberOfTables < currentNumberOfTables) {
        var numberOfTablesToBreakUp = currentNumberOfTables - optimalNumberOfTables;
        // Break up the tables with the lowest number of people
        var tables = exports.getTablesWithLeastSizeAndMovements(state, numberOfTablesToBreakUp);
        for (var _i = 0, tables_3 = tables; _i < tables_3.length; _i++) {
            var table = tables_3[_i];
            console.log("Breaking up table", table.id);
            var activeSeats = table.players.filter(function (p) { return p.participatingNextRound; }).map(function (p) { return p.seat; });
            fromSeats.add(table.id, activeSeats, activeSeats.length); // Move everyone
            totalNumberOfMovements += activeSeats.length;
            // Remove from tableSizes counter object
            tableIdsBeingBrokenUp.push(table.id);
        }
    }
    var tablesAfter = [];
    for (var _a = 0, _b = state.tables; _a < _b.length; _a++) {
        var table = _b[_a];
        if (tableIdsBeingBrokenUp.indexOf(table.id) === -1) {
            tablesAfter.push(table);
            table.extraPlayers = 0;
        }
    }
    // We also need to move those players on tables which now have too many players
    for (var _c = 0, _d = state.tables; _c < _d.length; _c++) {
        var table = _d[_c];
        var playersParticipatingNextRound = table.players.filter(function (p) { return p.participatingNextRound; }).length;
        if (playersParticipatingNextRound > maxNumberOfPlayersOnTables) {
            var movementsFromTable = playersParticipatingNextRound - maxNumberOfPlayersOnTables;
            console.log("Moving " + movementsFromTable + " players from table " + table.id);
            fromSeats.add(table.id, table.players.filter(function (p) { return p.participatingNextRound; }).map(function (p) { return p.seat; }), movementsFromTable);
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
    var remainingMovements = totalNumberOfMovements;
    while (remainingMovements > 0) {
        var lowestTables = exports.getTablesWithLowestSize(tablesAfter);
        // console.log(remainingMovements + " remaining.  Number of lowest tables is " + lowestTables.length);
        if (lowestTables.length <= remainingMovements) {
            // If there is a tie when assigning the next player to a table, just assign a player to each table.
            for (var _e = 0, lowestTables_1 = lowestTables; _e < lowestTables_1.length; _e++) {
                var table = lowestTables_1[_e];
                table.extraPlayers++;
                remainingMovements--;
            }
        }
        else {
            // So there are remainingMovements still to assign but lowestTables.length to choose from.
            // We need to fork the SeatSelections object for each combination
            console.log("There are " + remainingMovements + " still to assign but " + lowestTables.length + " to choose from");
            break;
        }
    }
    // console.log("tablesAfter is", tablesAfter);
    // Make the primary SeatSelections
    var toSeats = new seatSelections_1.default();
    for (var _f = 0, tablesAfter_1 = tablesAfter; _f < tablesAfter_1.length; _f++) {
        var table = tablesAfter_1[_f];
        if (table.extraPlayers > 0) {
            toSeats.add(table.id, util_1.invertSeatList(table.players.filter(function (p) { return p.participatingNextRound; }).map(function (p) { return p.seat; }), pokerNowMaxSeatId), table.extraPlayers);
        }
    }
    var targetSeats = [];
    // console.log("Initial target seats", targetSeats);
    if (remainingMovements > 0) {
        var lowestTables = exports.getTablesWithLowestSize(tablesAfter);
        var tableCombinations = util_1.getTableCombinations(lowestTables, remainingMovements);
        // console.log("Remaining movements", remainingMovements);
        // console.log("Table Combos", JSON.stringify(tableCombinations, null, 4));
        for (var _g = 0, tableCombinations_1 = tableCombinations; _g < tableCombinations_1.length; _g++) {
            var tableCombo = tableCombinations_1[_g];
            // Branch the primary toSeats
            var anotherSeatSelections = new seatSelections_1.default(toSeats);
            for (var _h = 0, tableCombo_1 = tableCombo; _h < tableCombo_1.length; _h++) {
                var table = tableCombo_1[_h];
                anotherSeatSelections.add(table.id, util_1.invertSeatList(table.players.filter(function (p) { return p.participatingNextRound; }).map(function (p) { return p.seat; }), pokerNowMaxSeatId), 1);
            }
            // console.log("anotherSeatSelections", anotherSeatSelections);
            targetSeats.push(anotherSeatSelections);
        }
    }
    else {
        targetSeats.push(toSeats);
    }
    // console.log("From Seats", fromSeats);
    // console.log("Target Seats", targetSeats);
    return {
        movements: totalNumberOfMovements,
        fromSeats: fromSeats,
        targetSeats: targetSeats,
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
exports.workOutTargetSeatPositions = function (table, sc) {
    // Given that the following seats would be filled next round, work out the seating positions next round
    // Apply all existing players to seats
    var players = table.players.filter(function (p) { return p.participatingNextRound; });
    var existingSeats = players.map(function (p) { return p.seat; });
    for (var _i = 0, sc_1 = sc; _i < sc_1.length; _i++) {
        var seat = sc_1[_i];
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
    players.sort(function (a, b) {
        return a.seat - b.seat;
    });
    // Work out where dealer button would be moving to
    var rotateBy = 1;
    for (var i = 0; i < players.length; i++) {
        if (players[i].seat < table.dealerButtonLastRound) {
            rotateBy++;
        }
    }
    positions_1.rotateArray(players, rotateBy);
    // Get all positions from dealer
    var positions = positions_1.getPositionsForTableSize(players.length);
    var targetSeats = [];
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.id === "x") {
            targetSeats.push({
                tableId: table.id,
                seat: player.seat,
                position: positions[i],
            });
        }
    }
    return targetSeats;
};
exports.getRebalancingPlayerMovements = function (state) {
    var result = exports.getRebalancingMovements(state);
    // console.log("RESULT", JSON.stringify(result, null, 4));
    // PROCESS FROM SEAT POSITIONS
    for (var _i = 0, _a = state.tables; _i < _a.length; _i++) {
        var table = _a[_i];
        positions_1.expandTablePositionsAsLastRound(table);
    }
    // console.log("TABLES", JSON.stringify(state, null, 4));
    // 1. Convert the fromSeats.selections seatIdList from Array<number> to Array<SeatPosition>
    var allSeatPositions = [];
    var _loop_1 = function (tableId) {
        var table = util_1.findTableById(state, tableId);
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
                var targetSeats = exports.workOutTargetSeatPositions(table, sc);
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
    // console.log("globalTargetSeats", globalTargetSeats);
    // 3. Then we need to try every possible ordering of these players with every possible ordering of targets.
    // This is where we can be more efficient.  If the score has already gone above some threshold, we can rule out every combination below using recursion.
    // Keep track of the lowest score from and target selections.
    var optimalResult = movement_1.getOptimalPlayerMovements(globalFromSeats, globalTargetSeats);
    // console.log("Final result", JSON.stringify(optimalResult, null, 4));
    // Convert the seatMovements in to playerMovements
    var playerMovements = [];
    var totalScore = 0;
    if (optimalResult !== null) {
        playerMovements = optimalResult.movements.map(function (sm) { return util_1.convertSeatMovementToPlayerMovement(state, sm); });
        totalScore = optimalResult.totalScore;
    }
    return {
        movements: playerMovements,
        totalScore: totalScore,
    };
};
//# sourceMappingURL=balancer.js.map