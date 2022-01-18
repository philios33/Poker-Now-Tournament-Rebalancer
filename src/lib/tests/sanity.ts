import { getRebalancingPlayerMovements } from "../balancer";
import { TournamentStateError } from "../../classes/tournamentStateError";
import { getMovingPlayerPositionScore } from "../movement";

test("General Sanity", () => {
    expect(() => getRebalancingPlayerMovements({} as any)).toThrow(TournamentStateError);

    expect(() => getRebalancingPlayerMovements({config: {
        maxPlayersPerTable: 10,
        breakWithLessThan: 5,
        balanceMaxFlexibility: 0,
        balanceMinFlexibility: 0,
    }, tables: [{
        id: "Identical",
        dealerButtonLastRound: 1,
        hasStartedNextRound: true,
        players: []
    },{
        id: "Identical",
        dealerButtonLastRound: 2,
        hasStartedNextRound: true,
        players: []
    }]})).toThrow("Tournament State Error: Duplicate table id found in state.tables: Identical");

    expect(() => getRebalancingPlayerMovements({config: {
        maxPlayersPerTable: 10,
        breakWithLessThan: 5,
        balanceMaxFlexibility: 0,
        balanceMinFlexibility: 0,
    }, tables: [{
        id: "Identical",
        dealerButtonLastRound: 1,
        hasStartedNextRound: true,
        players: [{
            id: "Player A",
            movements: 3,
            name: "Phil 1",
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 4,
        },{
            id: "Player B",
            movements: 1,
            name: "Phil 2",
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 7,
        }]
    },{
        id: "Identical 2",
        dealerButtonLastRound: 2,
        hasStartedNextRound: true,
        players: [{
            id: "Player B",
            movements: 16,
            name: "Phil 3",
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        }]
    }]})).toThrow("Tournament State Error: Duplicate player id Player B found at table with id: Identical 2 previously seen at table with id: Identical");

    expect(() => getRebalancingPlayerMovements({config: {
        maxPlayersPerTable: 10,
        breakWithLessThan: 5,
        balanceMaxFlexibility: 0,
        balanceMinFlexibility: 0,
    }, tables: [{
        id: "Identical",
        dealerButtonLastRound: 1,
        hasStartedNextRound: true,
        players: [{
            id: "Player A",
            movements: 3,
            name: "Phil 1",
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 4,
        },{
            id: "Player B",
            movements: 1,
            name: "Phil 2",
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 4,
        }]
    },{
        id: "Identical 2",
        dealerButtonLastRound: 2,
        hasStartedNextRound: true,
        players: [{
            id: "Player C",
            movements: 16,
            name: "Phil 3",
            participatingLastRound: true,
            participatingNextRound: true,
            seat: 1,
        }]
    }]})).toThrow("Tournament State Error: Seat 4 on table with id: Identical has more than 1 player in it");

    // Bug fix with positional matrices.  Due to dead button detection, we might add 1 to the number of players to get the positions with a dead button
    // This can cause (for example) a player with "UTG+4" position on a table with only 9 players.
    // This then causes havock with the scores system that doesn't know about UTG+4 on a 9 player table.
    // Make sure this doesn't cause an issue.
    expect(() => getMovingPlayerPositionScore("UTG+4", "D", 9)).not.toThrowError();
    // Even this should now not fail
    expect(() => getMovingPlayerPositionScore("UTG+14", "WTF", 3)).not.toThrowError();
});
