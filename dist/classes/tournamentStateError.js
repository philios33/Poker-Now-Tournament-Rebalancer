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
exports.TournamentStateError = void 0;
var TournamentStateError = /** @class */ (function (_super) {
    __extends(TournamentStateError, _super);
    function TournamentStateError(msg) {
        var _this = _super.call(this, "Tournament State Error: " + msg) || this;
        Object.setPrototypeOf(_this, TournamentStateError.prototype);
        return _this;
    }
    return TournamentStateError;
}(Error));
exports.TournamentStateError = TournamentStateError;
//# sourceMappingURL=tournamentStateError.js.map