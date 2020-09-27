"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalTableDetectedError = void 0;
var FinalTableDetectedError = /** @class */ (function (_super) {
    __extends(FinalTableDetectedError, _super);
    function FinalTableDetectedError(table) {
        var _this = _super.call(this, "Only 1 table is left") || this;
        _this.finalTable = table;
        Object.setPrototypeOf(_this, FinalTableDetectedError.prototype);
        return _this;
    }
    return FinalTableDetectedError;
}(Error));
exports.FinalTableDetectedError = FinalTableDetectedError;
//# sourceMappingURL=finalTableDetectedError.js.map