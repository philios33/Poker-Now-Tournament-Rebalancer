
import { getRebalancingMovements, getRebalancingPlayerMovements } from './lib/balancer';
import { PokerNowTournamentState } from './types/pokerNowTournamentState';
import { Config } from './types/config';
import { buildTournamentState } from './lib/util';

export function getMovements(state: PokerNowTournamentState, config: Config, tableIdThatCompletedHand: string) {
    return getRebalancingPlayerMovements(buildTournamentState(state, config, tableIdThatCompletedHand));
}
