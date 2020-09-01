"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandTablePositionsAsLastRound = exports.rotatePlayers = exports.sortBySeatDealerFirst = exports.getPositionsForTableSize = void 0;
exports.getPositionsForTableSize = function (size) {
    if (size === 2) {
        return ["D", "SB"];
    }
    else if (size === 3) {
        return ["D", "SB", "BB"];
    }
    else if (size === 4) {
        return ["D", "SB", "BB", "UTG"];
    }
    else if (size === 5) {
        return ["D", "SB", "BB", "UTG", "CO"];
    }
    else if (size === 6) {
        return ["D", "SB", "BB", "UTG", "HJ", "CO"];
    }
    else if (size > 6) {
        var utgExtra = size - 6;
        var positions = ["D", "SB", "BB", "UTG"];
        for (var i = 0; i < utgExtra; i++) {
            positions.push("UTG+" + (i + 1));
        }
        positions.push.apply(positions, ["HJ", "CO"]);
        return positions;
    }
    return ["D"];
};
exports.sortBySeatDealerFirst = function (players, dealer) {
    players.sort(function (a, b) {
        // Score should be position from dealer
        var aPosFromDealer = a.seat - dealer;
        var bPosFromDealer = b.seat - dealer;
        return aPosFromDealer - bPosFromDealer;
    });
};
/*
export const applyPositionsToPlayers = (positions: Array<string>, players: Array<Player>, dealer: number) => {

    // How many players are behind the dealer
    let behindDealer = 0;
    for(const player of players) {
        if (player.seat <= dealer) {
            behindDealer ++;
        }
    }
    behindDealer--; // Do it this way to cater for dead button.  We assume player before had the button.

    sortBySeatDealerFirst(players, dealer);

}
*/
exports.rotatePlayers = function (players, count) {
    var len = players.length >>> 0; // convert to uint
    count = count >> 0; // convert to int
    // convert count to value in range [0, len)
    count = ((count % len) + len) % len;
    // use splice.call() instead of this.splice() to make function generic
    players.push.apply(players, players.splice(0, count));
};
exports.expandTablePositionsAsLastRound = function (table) {
    // First work out what positions existed for this table last round
    table.players.sort(function (a, b) {
        return a.seat - b.seat;
    });
    var playersLastRound = table.players.filter(function (p) { return p.participatingLastRound; });
    var tableSize = playersLastRound.length;
    var deadButton = true;
    var seatsBeforeDealer = 0;
    for (var _i = 0, playersLastRound_1 = playersLastRound; _i < playersLastRound_1.length; _i++) {
        var player = playersLastRound_1[_i];
        if (player.seat === table.dealerButtonLastRound) {
            deadButton = false;
        }
        if (player.seat < table.dealerButtonLastRound) {
            seatsBeforeDealer++;
        }
    }
    var positions = exports.getPositionsForTableSize(tableSize);
    if (deadButton) {
        // Get 1 extra position and remove dealer
        positions = exports.getPositionsForTableSize(tableSize + 1);
        positions.shift();
    }
    // Now simply rotate so the players line up with their positions
    exports.rotatePlayers(playersLastRound, seatsBeforeDealer);
    // Then apply these positions around the table from the dealer position
    for (var i = 0; i < playersLastRound.length; i++) {
        playersLastRound[i].position = positions[i];
    }
};
//# sourceMappingURL=positions.js.map