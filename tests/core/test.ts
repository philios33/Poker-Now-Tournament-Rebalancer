import { getPositionsForTableSize } from '../../src/lib/positions';
import { expect } from 'chai';

describe('Core tests', () => {
    it('reports correct table positions for table sizes', () => {
        expect(getPositionsForTableSize(2)).to.eql(['D','SB']);
        expect(getPositionsForTableSize(7)).to.eql(['D','SB','BB','UTG','UTG+1','HJ','CO']);
        expect(getPositionsForTableSize(8)).to.eql(['D','SB','BB','UTG','UTG+1','UTG+2','HJ','CO']);
        expect(getPositionsForTableSize(9)).to.eql(['D','SB','BB','UTG','UTG+1','UTG+2','UTG+3','HJ','CO']);
        expect(getPositionsForTableSize(10)).to.eql(['D','SB','BB','UTG','UTG+1','UTG+2','UTG+3','UTG+4','HJ','CO']);
    });
});