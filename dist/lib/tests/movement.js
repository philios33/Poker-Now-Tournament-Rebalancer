"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var movement_1 = require("../movement");
test('getMovingPlayerPositionScore', function () {
    expect(movement_1.getMovingPlayerPositionScore("D", "CO")).toBe(0);
    expect(movement_1.getMovingPlayerPositionScore("CO", "HJ")).toBe(0);
    expect(movement_1.getMovingPlayerPositionScore("HJ", "UTG+4")).toBe(0);
    expect(movement_1.getMovingPlayerPositionScore("UTG+1", "UTG")).toBe(0);
    expect(movement_1.getMovingPlayerPositionScore("UTG", "BB")).toBe(0);
    expect(movement_1.getMovingPlayerPositionScore("BB", "SB")).toBe(0);
    expect(movement_1.getMovingPlayerPositionScore("SB", "D")).toBe(0);
    // Moving UTG+1 to BB is better than moving to SB
    expect(movement_1.getMovingPlayerPositionScore("UTG+1", "BB")).toBeLessThan(movement_1.getMovingPlayerPositionScore("UTG+1", "SB"));
    // Moving UTG to SB (skip BB) is better than moving UTG to D (skip SB & BB)
    expect(movement_1.getMovingPlayerPositionScore("UTG", "SB")).toBeLessThan(movement_1.getMovingPlayerPositionScore("UTG", "D"));
    // Moving BB to D is better than moving BB to CO
    expect(movement_1.getMovingPlayerPositionScore("BB", "D")).toBeLessThan(movement_1.getMovingPlayerPositionScore("BB", "CO"));
});
test('getMovementScoreFor', function () {
    expect(movement_1.getMovementScoreFor({
        movements: 0,
        position: "BB",
        seatId: 3,
        tableId: "A"
    }, {
        position: "SB",
        seat: 5,
        tableId: "B"
    })).toBe(0);
    expect(movement_1.getMovementScoreFor({
        movements: 1,
        position: "BB",
        seatId: 3,
        tableId: "A"
    }, {
        position: "UTG",
        seat: 5,
        tableId: "B"
    })).toBeLessThan(movement_1.getMovementScoreFor({
        movements: 1,
        position: "BB",
        seatId: 3,
        tableId: "A"
    }, {
        position: "UTG",
        seat: 5,
        tableId: "B"
    }));
});
test('getBestPlayerMovementsFor', function () {
    var seat1TableA = {
        tableId: "A",
        seatId: 1,
        movements: 0,
        position: "D",
    };
    var seat2TableA = {
        tableId: "A",
        seatId: 2,
        movements: 0,
        position: "SB",
    };
    var seat3TableA = {
        tableId: "A",
        seatId: 3,
        movements: 0,
        position: "BB",
    };
    var seatPositions = [seat1TableA, seat2TableA, seat3TableA];
    var seat1TableB = {
        position: "D",
        seat: 1,
        tableId: "B",
    };
    var seat2TableB = {
        position: "SB",
        seat: 2,
        tableId: "B",
    };
    var seat3TableB = {
        position: "BB",
        seat: 3,
        tableId: "B",
    };
    var targetSeats = [seat1TableB, seat2TableB, seat3TableB];
    var movement = movement_1.getBestPlayerMovementsFor(seatPositions, targetSeats);
    // The 3 movements we expect are: A1 -> B3, A2 -> B1, A3 -> B2
    expect(movement.movements[0].fromSeatPosition).toStrictEqual(seat1TableA);
    expect(movement.movements[0].targetSeat).toStrictEqual(seat3TableB);
    expect(movement.movements[1].fromSeatPosition).toStrictEqual(seat2TableA);
    expect(movement.movements[1].targetSeat).toStrictEqual(seat1TableB);
    expect(movement.movements[2].fromSeatPosition).toStrictEqual(seat3TableA);
    expect(movement.movements[2].targetSeat).toStrictEqual(seat2TableB);
});
test('getOptimalPlayerMovements', function () {
});
//# sourceMappingURL=movement.js.map