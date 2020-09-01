import { SeatSelection } from "../types/seatSelection";

export default class SeatSelections {

    selections: { [key: string]: SeatSelection };
    
    constructor(original: SeatSelections = null) {
        this.selections = {};
        if (original !== null) {
            this.selections = JSON.parse(JSON.stringify(original.selections));
        }
    }
    
    add(tableId: string, seatIdList: Array<number>, chooseNumber: number) {
        if (tableId in this.selections) {
            chooseNumber += this.selections[tableId].chooseNumber;
        }
        this.selections[tableId] = {
            tableId,
            seatIdList,
            chooseNumber
        };
    }

}