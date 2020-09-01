"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SeatSelections = /** @class */ (function () {
    function SeatSelections(original) {
        if (original === void 0) { original = null; }
        this.selections = {};
        if (original !== null) {
            this.selections = JSON.parse(JSON.stringify(original.selections));
        }
    }
    SeatSelections.prototype.add = function (tableId, seatIdList, chooseNumber) {
        if (tableId in this.selections) {
            chooseNumber += this.selections[tableId].chooseNumber;
        }
        this.selections[tableId] = {
            tableId: tableId,
            seatIdList: seatIdList,
            chooseNumber: chooseNumber
        };
    };
    return SeatSelections;
}());
exports.default = SeatSelections;
//# sourceMappingURL=seatSelections.js.map