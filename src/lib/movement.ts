import { TournamentState } from "../types/tournamentState"
import { TargetSeat } from "../types/targetSeat";
import { Player } from "../types/player";
import { SeatPosition } from "../types/seatPosition";
import { BalancingPlayersSeatResult } from "../types/balancingPlayersSeatResult";
import { SeatMovement } from "../types/seatMovement";

// As long as we return the target seats that are empty in an order where they will not make a difference to other positions (empty seats to the right of the dealer)
// If dealer will be seat 2 with [1,2,3] available, then this should be rotated to [2,3,1]

// This means that moving a player that has already moved will cost 50 points.
const playerMovementScoreWeighting = 50;

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

export const getMovingPlayerPositionScore = (fromPos: string, toPos: string): number => {
    /*

    D -> CO, HJ, UTG+4, UTG+2
    SB -> D, CO, HJ, UTG+4, SB
    BB -> SB, D, CO, HJ
    UTG -> BB, UTG, UTG+1, UTG+2 - Should not skip BB, more preferable to move player back
    HJ -> UTG+4, HJ, UTG+3, UTG+2, UTG+1, UTG
    CO -> HJ, CO, UTG+4, UTG+3, UTG+2 - Should not replay dealer or skip to blinds

    */
    /*

    0 = Perfect movement
    1-9 = Acceptable
    >10 = Not great

    */

    let weights = {
        "D": { "CO": 0, "HJ": 2, "D": 3, "UTG+4": 4, "UTG+3": 4, "UTG+2": 4, "UTG+1": 4, "UTG": 5, "BB": 10, "SB": 10 },
        "SB": { "D": 0, "CO": 2, "HJ": 3, "UTG+4": 4, "UTG+3": 4, "UTG+2": 4, "UTG+1": 4, "UTG": 5, "BB": 15, "SB": 10 },
        "BB": { "SB": 0, "D": 1, "CO": 2, "HJ": 3, "UTG+4": 4, "UTG+3": 4, "UTG+2": 4, "UTG+1": 4, "UTG": 5, "BB": 15 },
        "UTG": { "BB": 0, "UTG": 1, "UTG+1": 2, "UTG+2": 3, "UTG+3": 4, "UTG+4": 5, "HJ": 8, "CO": 10, "D": 15, "SB": 15 },
        "UTG+1": { "BB": 2, "UTG": 0, "UTG+1": 2, "UTG+2": 3, "UTG+3": 4, "UTG+4": 5, "HJ": 6, "CO": 7, "D": 15, "SB": 15 },
        "UTG+2": { "BB": 5, "UTG": 2, "UTG+1": 0, "UTG+2": 2, "UTG+3": 3, "UTG+4": 4, "HJ": 5, "CO": 6, "D": 15, "SB": 15 },
        "UTG+3": { "BB": 8, "UTG": 3, "UTG+1": 2, "UTG+2": 0, "UTG+3": 2, "UTG+4": 3, "HJ": 4, "CO": 5, "D": 15, "SB": 15 },
        "UTG+4": { "BB": 10, "UTG": 4, "UTG+1": 3, "UTG+2": 2, "UTG+3": 0, "UTG+4": 2, "HJ": 3, "CO": 4, "D": 15, "SB": 15 },
        "HJ": { "BB": 15, "UTG": 10, "UTG+1": 4, "UTG+2": 3, "UTG+3": 2, "UTG+4": 0, "HJ": 2, "CO": 3, "D": 15, "SB": 15 },
        "CO": { "BB": 15, "UTG": 10, "UTG+1": 5, "UTG+2": 4, "UTG+3": 3, "UTG+4": 2, "HJ": 0, "CO": 2, "D": 15, "SB": 15 },
    }

    if (fromPos in weights && toPos in weights[fromPos]) {
        return weights[fromPos][toPos];
    }
    throw new Error("Could not find movement score for position change of " + fromPos + " -> " + toPos);
}

export const getMovementScoreFor = (fromSeat: SeatPosition, targetSeat: TargetSeat) => {
    return (fromSeat.movements * playerMovementScoreWeighting) + getMovingPlayerPositionScore(fromSeat.position, targetSeat.position);
}

export const getBestPlayerMovementsFor = (fromSeats: Array<SeatPosition>, targetSeats: Array<TargetSeat>, giveUpIfScoreBreaches: number = null): BalancingPlayersSeatResult => {
    // Given this combination, work out the best movements to choose
    // Do this by applying the first fromSeat to the first targetSeat and trying out all other combinations
    let bestResult: BalancingPlayersSeatResult = null;
    for(let i=0; i<fromSeats.length; i++) {
        // Apply this startingSeat to the first targetSeat
        const otherFromSeats = fromSeats.slice(0);
        let fromSeat = otherFromSeats.splice(i, 1)[0];
        let targetSeat = targetSeats[0];
        let otherTargetSeats = targetSeats.slice(1);

        let score = getMovementScoreFor(fromSeat, targetSeat);

        let newBreachLimit = null;
        if (giveUpIfScoreBreaches !== null) {
            // For now, test without this optimisation
            /*
            if (score > giveUpIfScoreBreaches) {
                // Give up with this combo
                continue;
            } else {
                newBreachLimit = giveUpIfScoreBreaches - score;
            }
            */
        }

        // Then recurse with the rest of the otherFromSeats & otherTargetSeats if there are more remaining
        if (otherFromSeats.length > 0) {
            let result = getBestPlayerMovementsFor(otherFromSeats, otherTargetSeats, newBreachLimit);

            let totalScore = result.totalScore + score;

            if (bestResult === null || bestResult.totalScore > totalScore) {
                let movement: SeatMovement = {
                    fromSeatPosition: fromSeat,
                    targetSeat: targetSeat,
                    movementScore: score,
                }
                bestResult = {
                    movements: [movement, ...result.movements],
                    totalScore: totalScore,
                }
            }
        } else {

            if (bestResult === null || bestResult.totalScore > score) {
                let movement: SeatMovement = {
                    fromSeatPosition: fromSeat,
                    targetSeat: targetSeat,
                    movementScore: score,
                }
                bestResult = {
                    movements: [movement],
                    totalScore: score,
                }
            }
        }
    }
    return bestResult;
}

export const getOptimalPlayerMovements = (globalFromSeats: Array<Array<SeatPosition>>, globalTargetSeats: Array<Array<TargetSeat>>): BalancingPlayersSeatResult => {
    // Try every possible ordering of every fromSeats selection, with every possible selection of targetSeats.
    // The selections have already been expanded, we just need to try every combination of ordering of the fromSeats.
    // This is where we can be more efficient.  If the score has already gone above some threshold, we can rule out every combination below using recursion.
    // Keep track of the lowest score from and target selections.
    let bestResult = null;
    for (const froms of globalFromSeats) {
        for (const targets of globalTargetSeats) {
            // console.log("Getting best result of ", froms, targets);
            const result = getBestPlayerMovementsFor(froms, targets);
            // console.log("Result was: " + result.totalScore);
            if (bestResult === null || result.totalScore < bestResult.totalScore) {
                bestResult = result;
            }
        }
    }
    return bestResult;
}