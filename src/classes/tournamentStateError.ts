export class TournamentStateError extends Error {
    constructor(msg) {
        super("Tournament State Error: " + msg);
        Object.setPrototypeOf(this, TournamentStateError.prototype);
    }
}

