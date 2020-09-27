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
exports.NoActiveTablesError = void 0;
var NoActiveTablesError = /** @class */ (function (_super) {
    __extends(NoActiveTablesError, _super);
    function NoActiveTablesError() {
        var _this = _super.call(this, "No active tables") || this;
        Object.setPrototypeOf(_this, NoActiveTablesError.prototype);
        return _this;
    }
    return NoActiveTablesError;
}(Error));
exports.NoActiveTablesError = NoActiveTablesError;
//# sourceMappingURL=noActiveTableError.js.map