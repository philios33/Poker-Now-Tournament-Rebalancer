"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovements = void 0;
var balancer_1 = require("./lib/balancer");
var util_1 = require("./lib/util");
function getMovements(state, config, tableIdThatCompletedHand) {
    return balancer_1.getRebalancingPlayerMovements(util_1.buildTournamentState(state, config, tableIdThatCompletedHand));
}
exports.getMovements = getMovements;
//# sourceMappingURL=index.js.map