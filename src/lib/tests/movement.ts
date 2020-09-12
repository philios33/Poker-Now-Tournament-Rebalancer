import { getMovingPlayerPositionScore, getMovementScoreFor, getBestPlayerMovementsFor, getOptimalPlayerMovements, numberOfMovementsRequiredForSeats } from "../movement";
import { TargetSeat } from "../../types/targetSeat";
import { SeatPosition } from "../../types/seatPosition";
import { combine } from "../util";

test('getMovingPlayerPositionScore', () => {
    expect(getMovingPlayerPositionScore("D", "CO", 10)).toBe(0);
    expect(getMovingPlayerPositionScore("CO", "HJ", 10)).toBe(0);
    expect(getMovingPlayerPositionScore("HJ", "UTG+4", 10)).toBe(0);
    expect(getMovingPlayerPositionScore("UTG+1", "UTG", 10)).toBe(0);
    expect(getMovingPlayerPositionScore("UTG", "BB", 10)).toBe(0);
    expect(getMovingPlayerPositionScore("BB", "SB", 10)).toBe(0);
    expect(getMovingPlayerPositionScore("SB", "D", 10)).toBe(0);

    expect(getMovingPlayerPositionScore("D", "BB", 3)).toBe(0);
    expect(getMovingPlayerPositionScore("D", "UTG", 4)).toBe(0);
    expect(getMovingPlayerPositionScore("D", "CO", 5)).toBe(0);
    expect(getMovingPlayerPositionScore("D", "CO", 6)).toBe(0);
    expect(getMovingPlayerPositionScore("D", "CO", 7)).toBe(0);
    expect(getMovingPlayerPositionScore("D", "CO", 8)).toBe(0);
    expect(getMovingPlayerPositionScore("D", "CO", 9)).toBe(0);
    expect(getMovingPlayerPositionScore("D", "CO", 10)).toBe(0);

    expect(getMovingPlayerPositionScore("CO", "UTG", 5)).toBe(0);
    expect(getMovingPlayerPositionScore("CO", "HJ", 6)).toBe(0);
    expect(getMovingPlayerPositionScore("CO", "HJ", 7)).toBe(0);
    expect(getMovingPlayerPositionScore("CO", "HJ", 8)).toBe(0);
    expect(getMovingPlayerPositionScore("CO", "HJ", 9)).toBe(0);
    expect(getMovingPlayerPositionScore("CO", "HJ", 10)).toBe(0);

    expect(getMovingPlayerPositionScore("HJ", "UTG", 6)).toBe(0);
    expect(getMovingPlayerPositionScore("HJ", "UTG+1", 7)).toBe(0);
    expect(getMovingPlayerPositionScore("HJ", "UTG+2", 8)).toBe(0);
    expect(getMovingPlayerPositionScore("HJ", "UTG+3", 9)).toBe(0);
    expect(getMovingPlayerPositionScore("HJ", "UTG+4", 10)).toBe(0);
    

    // Moving UTG+1 to BB is better than moving to SB
    expect(getMovingPlayerPositionScore("UTG+1", "BB", 10)).toBeLessThan(getMovingPlayerPositionScore("UTG+1", "SB", 10));

    // Moving UTG to SB (skip BB) is better than moving UTG to D (skip SB & BB)
    expect(getMovingPlayerPositionScore("UTG", "SB", 10)).toBeLessThan(getMovingPlayerPositionScore("UTG", "D", 10));

    // Moving BB to D is better than moving BB to CO
    expect(getMovingPlayerPositionScore("BB", "D", 10)).toBeLessThan(getMovingPlayerPositionScore("BB", "CO", 10));

});

test('numberOfMovementsRequiredForSeats', () => {
    let total = 0;
    for(let n=1; n<=10; n++) {
        total++;
        total*=n;
        expect(numberOfMovementsRequiredForSeats(n)).toBe(total);
    }
})

test('getMovementScoreFor', () => {
    // Perfect score
    expect(getMovementScoreFor({
        movements:0,
        position:"BB",
        seatId:3,
        tableId:"A",
        numOfPlayers: 8,
    }, {
        position:"SB",
        seat:5,
        tableId:"B",
        numOfPlayers: 8,
    })).toBe(0);

    // BB to D is better than BB to CO
    expect(getMovementScoreFor({
        movements:0,
        position:"BB",
        seatId:3,
        tableId:"A",
        numOfPlayers: 8,
    }, {
        position:"D",
        seat:5,
        tableId:"B",
        numOfPlayers: 10
    })).toBeLessThan(getMovementScoreFor({
        movements:0,
        position:"BB",
        seatId:3,
        tableId:"A",
        numOfPlayers: 8,
    }, {
        position:"CO",
        seat:5,
        tableId:"B",
        numOfPlayers: 10
    }));

    // But not if there are more movements to the dealer
    expect(getMovementScoreFor({
        movements:6,
        position:"BB",
        seatId:3,
        tableId:"A",
        numOfPlayers: 8,
    }, {
        position:"D",
        seat:5,
        tableId:"B",
        numOfPlayers: 10,
    })).toBeGreaterThan(getMovementScoreFor({
        movements:5,
        position:"BB",
        seatId:3,
        tableId:"A",
        numOfPlayers: 8,
    }, {
        position:"CO",
        seat:5,
        tableId:"B",
        numOfPlayers: 10,
    }));
});

test('getBestPlayerMovementsFor 1', () => {
    const seat1TableA = {
        tableId: "A",
        seatId: 1,
        movements: 0,
        position: "D",
        numOfPlayers: 3,
    }
    const seat2TableA = {
        tableId: "A",
        seatId: 2,
        movements: 0,
        position: "SB",
        numOfPlayers: 3,
    }
    const seat3TableA = {
        tableId: "A",
        seatId: 3,
        movements: 0,
        position: "BB",
        numOfPlayers: 3,
    }
    const seatPositions: Array<SeatPosition> = [seat1TableA, seat2TableA, seat3TableA];

    const seat1TableB = {
        position: "D",
        seat: 1,
        tableId: "B",
        numOfPlayers: 3,
    }
    const seat2TableB = {
        position: "SB",
        seat: 2,
        tableId: "B",
        numOfPlayers: 3,
    }
    const seat3TableB = {
        position: "BB",
        seat: 3,
        tableId: "B",
        numOfPlayers: 3,
    }
    const targetSeats: Array<TargetSeat> = [seat1TableB, seat2TableB, seat3TableB];
    const movement = getBestPlayerMovementsFor(seatPositions, targetSeats);

    // This should be 15 because it checks
    /*
        A1->B1
                A2->B2
                        A3->B3
                A3->B2
                        A2->B3
        A2->B1
                A1->B2
                        A3->B3
                A3->B2
                        A1->B3 <-- Total = 10 (Best combo)
        A3->B1
                A1->B2
                        A2->B3
                A2->B2
                        A1->B3

    */

    // The 3 movements we expect are: A2 -> B1, A3 -> B2, A1 -> B3
    expect(movement.bestResult.movements[0].fromSeatPosition).toStrictEqual(seat2TableA);
    expect(movement.bestResult.movements[0].targetSeat).toStrictEqual(seat1TableB);
    expect(movement.bestResult.movements[1].fromSeatPosition).toStrictEqual(seat3TableA);
    expect(movement.bestResult.movements[1].targetSeat).toStrictEqual(seat2TableB);
    expect(movement.bestResult.movements[2].fromSeatPosition).toStrictEqual(seat1TableA);
    expect(movement.bestResult.movements[2].targetSeat).toStrictEqual(seat3TableB);
    // expect(movement.totalScore).toBe(0); // 3 perfect moves
    // This gives a false positive for D -> BB, because this is only perfect in a 3 player scenario.
    // TO FIX, It depends how many players are on the target table.
    // If you are Dealer on a table of 3, your next position would be BB, but if you are moving to a larger table, your next position could be CO or UTG.

    // There are 15 movements in total to check within the 6 possible solutions
    // Total = n(1 + (n-1)(n-1)) = n + n(n^2-2n+1) = n + n^3-2n^2+n = 
    // *** n^3 - 2n^2 + 2n ***
    // If n=3, 27 - 18 + 6 = 9 + 6 = 15
    // If n=2, 8 - 8 + 4 = 4
    // If n=1, 1 - 2 + 2 = 1
    // If n=4, 64 - 32 + 8 = 40

    /*

    1 -> 1
    2 -> 4
    3 -> 15
    4 -> 64
    5 -> 325
    6 -> 1956

    */

    expect(movement.totalMovementsSkipped + movement.totalMovementsChecked).toBe(15);
    // expect(movement.totalMovementsChecked).toBe(11);
    // expect(movement.totalMovementsSkipped).toBe(4);
});

test('getBestPlayerMovementsFor 2', () => {
    const seat1TableA = {
        tableId: "A",
        seatId: 1,
        movements: 0,
        position: "D",
        numOfPlayers: 4,
    }
    const seat2TableA = {
        tableId: "A",
        seatId: 2,
        movements: 0,
        position: "SB",
        numOfPlayers: 4,
    }
    const seat3TableA = {
        tableId: "A",
        seatId: 3,
        movements: 0,
        position: "BB",
        numOfPlayers: 4,
    }
    const seat4TableA = {
        tableId: "A",
        seatId: 4,
        movements: 0,
        position: "UTG",
        numOfPlayers: 4,
    }
    const seatPositions: Array<SeatPosition> = [seat1TableA, seat2TableA, seat3TableA, seat4TableA];

    const seat1TableB = {
        position: "D",
        seat: 1,
        tableId: "B",
        numOfPlayers: 4,
    }
    const seat2TableB = {
        position: "SB",
        seat: 2,
        tableId: "B",
        numOfPlayers: 4,
    }
    const seat3TableB = {
        position: "BB",
        seat: 3,
        tableId: "B",
        numOfPlayers: 4,
    }
    const seat4TableB = {
        position: "UTG",
        seat: 4,
        tableId: "B",
        numOfPlayers: 4,
    }
    const targetSeats: Array<TargetSeat> = [seat1TableB, seat2TableB, seat3TableB, seat4TableB];
    const movement = getBestPlayerMovementsFor(seatPositions, targetSeats);

    expect(movement.totalMovementsSkipped + movement.totalMovementsChecked).toBe(64);
    // expect(movement.totalMovementsChecked).toBe(22);
    // expect(movement.totalMovementsSkipped).toBe(42);
});

test('getBestPlayerMovementsFor 3', () => {
    const seat1TableA = {
        tableId: "A",
        seatId: 1,
        movements: 0,
        position: "D",
        numOfPlayers: 5,
    }
    const seat2TableA = {
        tableId: "A",
        seatId: 2,
        movements: 0,
        position: "SB",
        numOfPlayers: 5,
    }
    const seat3TableA = {
        tableId: "A",
        seatId: 3,
        movements: 0,
        position: "BB",
        numOfPlayers: 5,
    }
    const seat4TableA = {
        tableId: "A",
        seatId: 4,
        movements: 0,
        position: "UTG",
        numOfPlayers: 5,
    }
    const seat5TableA = {
        tableId: "A",
        seatId: 5,
        movements: 0,
        position: "UTG+1",
        numOfPlayers: 5,
    }
    const seatPositions: Array<SeatPosition> = [seat1TableA, seat2TableA, seat3TableA, seat4TableA, seat5TableA];

    const seat1TableB = {
        position: "D",
        seat: 1,
        tableId: "B",
        numOfPlayers: 7,
    }
    const seat2TableB = {
        position: "SB",
        seat: 2,
        tableId: "B",
        numOfPlayers: 7,
    }
    const seat3TableB = {
        position: "BB",
        seat: 3,
        tableId: "B",
        numOfPlayers: 7,
    }
    const seat4TableB = {
        position: "UTG",
        seat: 4,
        tableId: "B",
        numOfPlayers: 7,
    }
    const seat5TableB = {
        position: "UTG+1",
        seat: 5,
        tableId: "B",
        numOfPlayers: 7,
    }
    const targetSeats: Array<TargetSeat> = [seat1TableB, seat2TableB, seat3TableB, seat4TableB, seat5TableB];
    const movement = getBestPlayerMovementsFor(seatPositions, targetSeats);

    expect(movement.totalMovementsSkipped + movement.totalMovementsChecked).toBe(325);
    // expect(movement.totalMovementsChecked).toBe(60);
    // expect(movement.totalMovementsSkipped).toBe(265);
});

test('getOptimalPlayerMovements', () => {
    const seat1TableA = {
        tableId: "A",
        seatId: 1,
        movements: 0,
        position: "D",
        numOfPlayers: 3,
    }
    const seat2TableA = {
        tableId: "A",
        seatId: 2,
        movements: 0,
        position: "SB",
        numOfPlayers: 3,
    }
    const seat3TableA = {
        tableId: "A",
        seatId: 3,
        movements: 0,
        position: "BB",
        numOfPlayers: 3,
    }

    const seat4TableB = {
        position: "UTG",
        seat: 4,
        tableId: "B",
        numOfPlayers: 8,
    }
    const seat5TableB = {
        position: "UTG+1",
        seat: 5,
        tableId: "B",
        numOfPlayers: 8,
    }
    const seat6TableB = {
        position: "UTG+2",
        seat: 6,
        tableId: "B",
        numOfPlayers: 8,
    }
    
    const movements = getOptimalPlayerMovements([[seat1TableA], [seat2TableA], [seat3TableA]], [[seat4TableB], [seat5TableB], [seat6TableB]]);
    
    expect(movements.bestResult.movements[0].fromSeatPosition).toStrictEqual(seat1TableA);
    expect(movements.bestResult.movements[0].targetSeat).toStrictEqual(seat6TableB);
    expect(movements.bestResult.totalScore).toBeGreaterThan(0); // Not perfect, but hey
    expect(movements.totalMovementsChecked).toBe(9); // 3 lots of 3 combos
});