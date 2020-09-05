import { getPositionsForTableSize } from '../positions';

test('reports correct table positions for table sizes', () => {
    expect(getPositionsForTableSize(2)).toStrictEqual(['D','SB']);
    expect(getPositionsForTableSize(7)).toStrictEqual(['D','SB','BB','UTG','UTG+1','HJ','CO']);
    expect(getPositionsForTableSize(8)).toStrictEqual(['D','SB','BB','UTG','UTG+1','UTG+2','HJ','CO']);
    expect(getPositionsForTableSize(9)).toStrictEqual(['D','SB','BB','UTG','UTG+1','UTG+2','UTG+3','HJ','CO']);
    expect(getPositionsForTableSize(10)).toStrictEqual(['D','SB','BB','UTG','UTG+1','UTG+2','UTG+3','UTG+4','HJ','CO']);
});
