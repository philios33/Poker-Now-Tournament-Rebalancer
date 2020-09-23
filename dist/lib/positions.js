"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandTablePositionsAsLastRound = exports.rotateArray = exports.getPositionsForTableSize = void 0;
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
exports.rotateArray = function (players, count) {
    var len = players.length >>> 0; // convert to uint
    count = count >> 0; // convert to int
    // convert count to value in range [0, len)
    count = ((count % len) + len) % len;
    // use splice.call() instead of this.splice() to make function generic
    players.push.apply(players, players.splice(0, count));
};
exports.expandTablePositionsAsLastRound = function (table) {
    // First work out what positions existed for this table last round
    // Note: Sometimes you need to work out positions for the round after because the table has already started the next round
    var nextHand = 0;
    if (table.hasStartedNextRound) {
        nextHand = 1;
    }
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
    if (deadButton && nextHand === 0) {
        // Get 1 extra position and remove dealer
        positions = exports.getPositionsForTableSize(tableSize + 1);
        positions.shift();
    }
    // Adding the extra hands here.  Set to 1 to skip forward an extra hand.
    if (nextHand === 1) {
        if (!deadButton) {
            seatsBeforeDealer += 1; // Don't add 1 if the button is dead because there is the same number of seats behind the button.
        }
        else {
            // But if the button was dead and there are more players now, push the button on.
            seatsBeforeDealer += table.players.filter(function (p) { return p.participatingNextRound; }).length - table.players.filter(function (p) { return p.participatingLastRound; }).length;
        }
        // We MUST recalculate the "players last round" as the players NEXT round.
        playersLastRound = table.players.filter(function (p) { return p.participatingNextRound; });
        // Not enough information to work out if button is still dead.  Assume it's not
        positions = exports.getPositionsForTableSize(playersLastRound.length);
    }
    // Now simply rotate so the players line up with their positions
    exports.rotateArray(playersLastRound, seatsBeforeDealer);
    // Then apply these positions around the table from the dealer position
    for (var i = 0; i < playersLastRound.length; i++) {
        playersLastRound[i].position = positions[i];
    }
};
//# sourceMappingURL=positions.js.map