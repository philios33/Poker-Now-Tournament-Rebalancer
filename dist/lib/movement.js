"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptimalPlayerMovements = exports.getBestPlayerMovementsFor = exports.numberOfMovementsRequiredForSeats = exports.getMovementScoreFor = exports.getMovingPlayerPositionScore = void 0;
var util_1 = require("./util");
// As long as we return the target seats that are empty in an order where they will not make a difference to other positions (empty seats to the right of the dealer)
// If dealer will be seat 2 with [1,2,3] available, then this should be rotated to [2,3,1]
// This means that moving a player that has already moved will cost 50 points.
var playerMovementScoreWeighting = 50;
// Here we work out the score for a movement given an array of players (with prev positions) and an array of seat assignments
// Not used
/*
export const getMovementScore = (state: TournamentState, movingPlayers: Array<Player>, seats: Array<TargetSeat>): number => {
    let score = 0;
    for(let i=0; i < movingPlayers.length; i++) {
        const player = movingPlayers[i];
        const seat = seats[i];
        score += getMovingPlayerPositionScore(player.position, seat.position);
    }
    return score;
}
*/
exports.getMovingPlayerPositionScore = function (fromPos, toPos, toNum) {
    if (toNum < 2) {
        throw new Error("To number is too low, must be between 2 and 10: " + toNum);
    }
    else if (toNum > 10) {
        throw new Error("To number is too high, must be between 2 and 10: " + toNum);
    }
    /*

    0 = Perfect movement
    1-9 = Acceptable
    >10 = Not great

    */
    var weights2 = {
        "D": { "D": 10, "SB": 0 },
        "SB": { "D": 0, "SB": 10 },
    };
    var weights3 = {
        "D": { "D": 5, "SB": 10, "BB": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15 },
        "BB": { "D": 5, "SB": 0, "BB": 15 },
    };
    var weights4 = {
        "D": { "D": 2, "SB": 10, "BB": 6, "UTG": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15, "UTG": 7 },
        "BB": { "D": 8, "SB": 0, "BB": 15, "UTG": 15 },
        "UTG": { "D": 12, "SB": 12, "BB": 0, "UTG": 5 },
    };
    var weights5 = {
        "D": { "D": 2, "SB": 10, "BB": 6, "UTG": 4, "CO": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15, "UTG": 10, "CO": 5 },
        "BB": { "D": 5, "SB": 0, "BB": 15, "UTG": 15, "CO": 8 },
        "UTG": { "D": 12, "SB": 12, "BB": 0, "UTG": 5, "CO": 9 },
        "CO": { "D": 8, "SB": 15, "BB": 10, "UTG": 0, "CO": 5 },
    };
    var weights6 = {
        "D": { "D": 3, "SB": 10, "BB": 15, "UTG": 10, "HJ": 5, "CO": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15, "UTG": 10, "HJ": 10, "CO": 5 },
        "BB": { "D": 5, "SB": 0, "BB": 15, "UTG": 15, "HJ": 15, "CO": 10 },
        "UTG": { "D": 12, "SB": 12, "BB": 0, "UTG": 3, "HJ": 7, "CO": 10 },
        "HJ": { "D": 10, "SB": 15, "BB": 10, "UTG": 0, "HJ": 5, "CO": 8 },
        "CO": { "D": 8, "SB": 15, "BB": 10, "UTG": 5, "HJ": 0, "CO": 5 },
    };
    var weights7 = {
        "D": { "D": 3, "SB": 10, "BB": 15, "UTG": 15, "UTG+1": 10, "HJ": 5, "CO": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15, "UTG": 10, "UTG+1": 9, "HJ": 8, "CO": 5 },
        "BB": { "D": 5, "SB": 0, "BB": 15, "UTG": 15, "UTG+1": 12, "HJ": 10, "CO": 8 },
        "UTG": { "D": 12, "SB": 12, "BB": 0, "UTG": 3, "UTG+1": 5, "HJ": 7, "CO": 10 },
        "UTG+1": { "D": 15, "SB": 15, "BB": 5, "UTG": 0, "UTG+1": 5, "HJ": 10, "CO": 15 },
        "HJ": { "D": 10, "SB": 15, "BB": 10, "UTG": 5, "UTG+1": 0, "HJ": 5, "CO": 8 },
        "CO": { "D": 8, "SB": 15, "BB": 15, "UTG": 10, "UTG+1": 5, "HJ": 0, "CO": 5 },
    };
    var weights8 = {
        "D": { "D": 3, "SB": 10, "BB": 15, "UTG": 15, "UTG+1": 10, "UTG+2": 8, "HJ": 5, "CO": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15, "UTG": 15, "UTG+1": 10, "UTG+2": 9, "HJ": 8, "CO": 5 },
        "BB": { "D": 5, "SB": 0, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 12, "HJ": 10, "CO": 8 },
        "UTG": { "D": 12, "SB": 15, "BB": 0, "UTG": 3, "UTG+1": 5, "UTG+2": 8, "HJ": 10, "CO": 10 },
        "UTG+1": { "D": 15, "SB": 15, "BB": 5, "UTG": 0, "UTG+1": 5, "UTG+2": 10, "HJ": 10, "CO": 15 },
        "UTG+2": { "D": 15, "SB": 15, "BB": 10, "UTG": 5, "UTG+1": 0, "UTG+2": 5, "HJ": 10, "CO": 15 },
        "HJ": { "D": 10, "SB": 15, "BB": 15, "UTG": 10, "UTG+1": 5, "UTG+2": 0, "HJ": 5, "CO": 8 },
        "CO": { "D": 8, "SB": 15, "BB": 15, "UTG": 15, "UTG+1": 10, "UTG+2": 5, "HJ": 0, "CO": 5 },
    };
    var weights9 = {
        "D": { "D": 3, "SB": 10, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 15, "UTG+3": 10, "HJ": 5, "CO": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 10, "UTG+3": 9, "HJ": 8, "CO": 5 },
        "BB": { "D": 5, "SB": 0, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 15, "UTG+3": 10, "HJ": 9, "CO": 8 },
        "UTG": { "D": 15, "SB": 15, "BB": 0, "UTG": 3, "UTG+1": 5, "UTG+2": 8, "UTG+3": 10, "HJ": 15, "CO": 15 },
        "UTG+1": { "D": 15, "SB": 15, "BB": 5, "UTG": 0, "UTG+1": 5, "UTG+2": 10, "UTG+3": 15, "HJ": 15, "CO": 15 },
        "UTG+2": { "D": 15, "SB": 15, "BB": 10, "UTG": 5, "UTG+1": 0, "UTG+2": 5, "UTG+3": 10, "HJ": 15, "CO": 15 },
        "UTG+3": { "D": 15, "SB": 15, "BB": 15, "UTG": 10, "UTG+1": 5, "UTG+2": 0, "UTG+3": 5, "HJ": 10, "CO": 15 },
        "HJ": { "D": 10, "SB": 15, "BB": 15, "UTG": 15, "UTG+1": 10, "UTG+2": 5, "UTG+3": 0, "HJ": 5, "CO": 8 },
        "CO": { "D": 8, "SB": 15, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 10, "UTG+3": 5, "HJ": 0, "CO": 5 },
    };
    var weights10 = {
        "D": { "D": 3, "SB": 10, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 10, "UTG+3": 9, "UTG+4": 8, "HJ": 5, "CO": 0 },
        "SB": { "D": 0, "SB": 10, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 15, "UTG+3": 10, "UTG+4": 9, "HJ": 8, "CO": 5 },
        "BB": { "D": 5, "SB": 0, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 15, "UTG+3": 15, "UTG+4": 10, "HJ": 9, "CO": 8 },
        "UTG": { "D": 15, "SB": 12, "BB": 0, "UTG": 3, "UTG+1": 5, "UTG+2": 8, "UTG+3": 10, "UTG+4": 15, "HJ": 15, "CO": 15 },
        "UTG+1": { "D": 15, "SB": 15, "BB": 5, "UTG": 0, "UTG+1": 5, "UTG+2": 10, "UTG+3": 15, "UTG+4": 15, "HJ": 15, "CO": 15 },
        "UTG+2": { "D": 15, "SB": 15, "BB": 10, "UTG": 5, "UTG+1": 0, "UTG+2": 5, "UTG+3": 10, "UTG+4": 12, "HJ": 15, "CO": 15 },
        "UTG+3": { "D": 15, "SB": 15, "BB": 15, "UTG": 10, "UTG+1": 5, "UTG+2": 0, "UTG+3": 5, "UTG+4": 10, "HJ": 12, "CO": 15 },
        "UTG+4": { "D": 15, "SB": 15, "BB": 15, "UTG": 15, "UTG+1": 10, "UTG+2": 5, "UTG+3": 0, "UTG+4": 5, "HJ": 10, "CO": 15 },
        "HJ": { "D": 10, "SB": 15, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 10, "UTG+3": 5, "UTG+4": 0, "HJ": 5, "CO": 8 },
        "CO": { "D": 8, "SB": 15, "BB": 15, "UTG": 15, "UTG+1": 15, "UTG+2": 15, "UTG+3": 10, "UTG+4": 5, "HJ": 0, "CO": 5 },
    };
    var allWeights = [weights2, weights3, weights4, weights5, weights6, weights7, weights8, weights9, weights10];
    var weights = allWeights[toNum - 2]; // Offset by 2
    if (fromPos in weights && toPos in weights[fromPos]) {
        return weights[fromPos][toPos];
    }
    throw new Error("Could not find movement score for position change of " + fromPos + " -> " + toPos);
};
exports.getMovementScoreFor = function (fromSeat, targetSeat) {
    return (fromSeat.movements * playerMovementScoreWeighting) + exports.getMovingPlayerPositionScore(fromSeat.position, targetSeat.position, Math.max(fromSeat.numOfPlayers, targetSeat.numOfPlayers));
};
exports.numberOfMovementsRequiredForSeats = function (seats) {
    if (seats === 0) {
        return 0;
    }
    else if (seats === 1) {
        return 1;
    }
    else if (seats === 2) {
        return 4;
    }
    else if (seats === 3) {
        return 15;
    }
    else if (seats === 4) {
        return 64;
    }
    else if (seats === 5) {
        return 325;
    }
    else if (seats === 6) {
        return 1956;
    }
    else if (seats === 7) {
        return 13699;
    }
    else if (seats === 8) {
        return 109600;
    }
    else if (seats === 9) {
        return 986409;
    }
    else if (seats === 10) {
        return 9864100;
    }
    else {
        throw new Error("Unknown number of movements required for seats: " + seats);
    }
};
exports.getBestPlayerMovementsFor = function (fromSeats, targetSeats, movementCheckLimit, giveUpIfScoreBreaches, consoleText) {
    if (giveUpIfScoreBreaches === void 0) { giveUpIfScoreBreaches = null; }
    if (consoleText === void 0) { consoleText = ""; }
    var totalMovementsChecked = 0;
    var totalMovementsSkipped = 0;
    // Given this combination, work out the best movements to choose
    // Do this by applying the first fromSeat to the first targetSeat and trying out all other combinations
    var bestResult = null;
    var maxChecksPerSeat = Math.round(movementCheckLimit / fromSeats.length); // Divide equally between the remaining seats
    for (var i = 0; i < fromSeats.length; i++) {
        // Apply this startingSeat to the first targetSeat
        var otherFromSeats = fromSeats.slice(0);
        var fromSeat = otherFromSeats.splice(i, 1)[0];
        var targetSeat = targetSeats[0];
        var otherTargetSeats = targetSeats.slice(1);
        var score = exports.getMovementScoreFor(fromSeat, targetSeat);
        var thisConsoleText = ",(" + fromSeats.length + ";" + targetSeats.length + ") [" + fromSeat.tableId + ":" + fromSeat.seatId + " to " + targetSeat.tableId + ":" + targetSeat.seat + " = " + score + "/" + giveUpIfScoreBreaches + "]";
        // console.log(consoleText + thisConsoleText);
        totalMovementsChecked++;
        var newBreachLimit = giveUpIfScoreBreaches;
        if (giveUpIfScoreBreaches !== null) {
            // For now, test without this optimisation            
            if (score >= giveUpIfScoreBreaches) {
                // Give up with this combo
                // console.log(consoleText + " The total score has breached: " + giveUpIfScoreBreaches + " so we are giving up");
                // Calculate how many checks we skipped here.
                totalMovementsSkipped += exports.numberOfMovementsRequiredForSeats(otherFromSeats.length);
                continue;
            }
            else {
                newBreachLimit = giveUpIfScoreBreaches - score;
            }
        }
        // Then recurse with the rest of the otherFromSeats & otherTargetSeats if there are more remaining
        if (otherFromSeats.length > 0) {
            // console.log("Recursing...");
            var result = exports.getBestPlayerMovementsFor(otherFromSeats, otherTargetSeats, maxChecksPerSeat, newBreachLimit, consoleText + thisConsoleText);
            // This is always returned even when no best player movements are found
            totalMovementsChecked += result.totalMovementsChecked;
            totalMovementsSkipped += result.totalMovementsSkipped;
            if (result.bestResult !== null) {
                var totalScore = result.bestResult.totalScore + score;
                //       console.log("Recursed deeper, adding result", result.totalMovementsChecked);
                // console.log("The best result for the other " + otherFromSeats.length + " seats was " + result.bestResult.totalScore + " so total so far for these " + (otherFromSeats.length + 1) + " seats is " + totalScore);
                if (bestResult === null || bestResult.totalScore > totalScore) {
                    var movement = {
                        fromSeatPosition: fromSeat,
                        targetSeat: targetSeat,
                        movementScore: score,
                    };
                    bestResult = {
                        movements: __spreadArrays([movement], result.bestResult.movements),
                        totalScore: totalScore,
                    };
                    giveUpIfScoreBreaches = totalScore;
                }
                // console.log("Score for: " + [{fromSeat, targetSeat}, ...result.movements]);
            }
        }
        else {
            if (bestResult === null || bestResult.totalScore > score) {
                var movement = {
                    fromSeatPosition: fromSeat,
                    targetSeat: targetSeat,
                    movementScore: score,
                };
                bestResult = {
                    movements: [movement],
                    totalScore: score,
                };
            }
            // console.log("Score for: " + [{fromSeat, targetSeat}]);
        }
        if (totalMovementsChecked > movementCheckLimit) {
            break;
        }
    }
    // console.log("Returning best player movements after checks: " + totalMovementsChecked);
    return { bestResult: bestResult, totalMovementsChecked: totalMovementsChecked, totalMovementsSkipped: totalMovementsSkipped };
};
exports.getOptimalPlayerMovements = function (globalFromSeats, globalTargetSeats) {
    // Try every possible ordering of every fromSeats selection, with every possible selection of targetSeats.
    // The selections have already been expanded, we just need to try every combination of ordering of the fromSeats.
    // This is where we can be more efficient.  If the score has already gone above some threshold, we can rule out every combination below using recursion.
    // Keep track of the lowest score from and target selections.
    var bestResult = null;
    var bestScore = null;
    var totalMovementsChecked = 0;
    var totalMovementsSkipped = 0;
    // console.log("From Combo Count", globalFromSeats.length);
    // console.log("Target Combo Count", globalTargetSeats.length);
    // If there are too many combinations, we could try doing only 5 seconds of processing the combinations and just go with the best result.
    // const stopAfterMs = 5000;
    // We now limit the number of checks made so that we dont thrash the CPU.  This is better than trying to find best results for X seconds.
    var maxChecksToMake = 800 * 1000;
    // If we do this, it is important to shuffle the 2 arrays
    // It is better to multiply these arrays first, then randomise the result
    // This would give more of a range of from seat combos
    var joinedGlobals = util_1.multiplyArrays(globalFromSeats, globalTargetSeats, false);
    var totalCombinations = joinedGlobals.length;
    joinedGlobals.sort(function () { return Math.random() - 0.5; });
    var checksPerCombo = Math.round(maxChecksToMake / totalCombinations);
    var startTime = (new Date()).getTime();
    var processedCombinations = 0;
    for (var _i = 0, joinedGlobals_1 = joinedGlobals; _i < joinedGlobals_1.length; _i++) {
        var joinedItem = joinedGlobals_1[_i];
        var froms = joinedItem[0];
        var targets = joinedItem[1];
        // console.log("Getting best result of ", froms, targets);
        var result = exports.getBestPlayerMovementsFor(froms, targets, checksPerCombo, bestScore);
        processedCombinations++;
        totalMovementsChecked += result.totalMovementsChecked;
        totalMovementsSkipped += result.totalMovementsSkipped;
        // console.log("Result was: " + result.totalScore);
        if (bestResult === null || (result.bestResult !== null && result.bestResult.totalScore < bestResult.totalScore)) {
            bestResult = result.bestResult;
            if (result.bestResult !== null) {
                bestScore = result.bestResult.totalScore;
            }
        }
        // console.log("Best score is", bestScore);
        // Check if the time is up
        // const timeNow = (new Date()).getTime();
        // if (timeNow - startTime > stopAfterMs) {
        // console.log("Stopping after: " + stopAfterMs + " ms");
        //    break;
        //}
    }
    // console.log("Processed " + processedCombinations + " of " + totalCombinations);
    // console.log("BEST RESULT", bestResult);
    return { bestResult: bestResult, totalCombinations: totalCombinations, processedCombinations: processedCombinations, totalMovementsChecked: totalMovementsChecked, totalMovementsSkipped: totalMovementsSkipped };
};
//# sourceMappingURL=movement.js.map