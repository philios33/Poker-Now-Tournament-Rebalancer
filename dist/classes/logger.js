"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger(enabled, message) {
        this.entries = [];
        this.lastEntry = null;
        this.enabled = enabled;
        this.log(message);
    }
    Logger.prototype.log = function (message) {
        if (this.enabled) {
            var entry = {
                occurred: new Date,
                message: message,
            };
            this.entries.push(entry);
            var diff = 0;
            if (this.lastEntry !== null) {
                diff = entry.occurred.getTime() - this.lastEntry.occurred.getTime();
            }
            console.log(entry.occurred, entry.message, diff + " ms");
            this.lastEntry = entry;
        }
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map