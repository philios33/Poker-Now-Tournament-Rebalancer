import { Table } from "../types/table";

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

export const rotateArray = (players: Array<any>, count: number) => {
    var len = players.length >>> 0; // convert to uint
    count = count >> 0; // convert to int

    // convert count to value in range [0, len)
    count = ((count % len) + len) % len;

    // use splice.call() instead of this.splice() to make function generic
    players.push(...players.splice(0, count));
}

export const expandTablePositionsAsLastRound = (table: Table) => {
    // First work out what positions existed for this table last round
    // Note: Sometimes you need to work out positions for the round after because the table has already started the next round
    let nextHand = 0;
    if (table.hasStartedNextRound) {
        nextHand = 1;
    }
    table.players.sort((a,b) => {
        return a.seat - b.seat;
    });

    let playersLastRound = table.players.filter(p => p.participatingLastRound)
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
    if (deadButton && nextHand === 0) {
        // Get 1 extra position and remove dealer
        positions = getPositionsForTableSize(tableSize+1);
        positions.shift();
    }

    // Adding the extra hands here.  Set to 1 to skip forward an extra hand.
    if (nextHand === 1) {
        if (!deadButton) {
            seatsBeforeDealer += 1; // Don't add 1 if the button is dead because there is the same number of seats behind the button.
        } else {
            // But if the button was dead and there are more players now, push the button on.
            seatsBeforeDealer += table.players.filter(p => p.participatingNextRound).length - table.players.filter(p => p.participatingLastRound).length;
        }
        
        // We MUST recalculate the "players last round" as the players NEXT round.
        playersLastRound = table.players.filter(p => p.participatingNextRound);
        // Not enough information to work out if button is still dead.  Assume it's not
        positions = getPositionsForTableSize(playersLastRound.length);
    }
    

    // Now simply rotate so the players line up with their positions
    rotateArray(playersLastRound, seatsBeforeDealer);

    // Then apply these positions around the table from the dealer position
    for (let i=0; i<playersLastRound.length; i++) {
        playersLastRound[i].position = positions[i];
    }
}