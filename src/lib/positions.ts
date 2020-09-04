import { Table } from "../types/table";
import { Player } from "../types/player";

export const getPositionsForTableSize = (size: number) => {
    if (size === 2) {
        return ["D", "SB"];
    } else if (size === 3) {
        return ["D", "SB", "BB"];
    } else if (size === 4) {
        return ["D", "SB", "BB", "UTG"];
    } else if (size === 5) {
        return ["D", "SB", "BB", "UTG", "CO"];
    } else if (size === 6) {
        return ["D", "SB", "BB", "UTG", "HJ", "CO"];
    } else if (size > 6) {
        let utgExtra = size - 6;
        let positions = ["D", "SB", "BB", "UTG"];
        for(let i=0; i<utgExtra; i++) {
            positions.push("UTG+" + (i+1));
        }
        positions.push(...["HJ", "CO"]);
        return positions;
    }

    return ["D"];
}

export const sortBySeatDealerFirst = (players: Array<Player>, dealer: number) => {
    players.sort((a,b) => {
        // Score should be position from dealer
        let aPosFromDealer = a.seat - dealer;
        let bPosFromDealer = b.seat - dealer;
        return aPosFromDealer - bPosFromDealer;
    });
}

export const rotatePlayers = (players: Array<any>, count: number) => {
    var len = players.length >>> 0; // convert to uint
    count = count >> 0; // convert to int

    // convert count to value in range [0, len)
    count = ((count % len) + len) % len;

    // use splice.call() instead of this.splice() to make function generic
    players.push(...players.splice(0, count));
}

export const expandTablePositionsAsLastRound = (table: Table) => {
    // First work out what positions existed for this table last round
    table.players.sort((a,b) => {
        return a.seat - b.seat;
    });

    const playersLastRound = table.players.filter(p => p.participatingLastRound)
    const tableSize = playersLastRound.length;
    let deadButton = true;
    let seatsBeforeDealer = 0;
    for(const player of playersLastRound) {
        if (player.seat === table.dealerButtonLastRound) {
            deadButton = false;
        }
        if (player.seat < table.dealerButtonLastRound) {
            seatsBeforeDealer++;
        }
    }
    let positions = getPositionsForTableSize(tableSize);
    if (deadButton) {
        // Get 1 extra position and remove dealer
        positions = getPositionsForTableSize(tableSize+1);
        positions.shift();
    }

    // Now simply rotate so the players line up with their positions
    rotatePlayers(playersLastRound, seatsBeforeDealer);

    // Then apply these positions around the table from the dealer position
    for (let i=0; i<playersLastRound.length; i++) {
        playersLastRound[i].position = positions[i];
    }
}