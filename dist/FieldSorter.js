"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FieldSorter {
    constructor(appendOrder) {
        this._appendOrder = appendOrder;
    }
    asc() {
        return this._appendOrder(" ASC,");
    }
    desc() {
        return this._appendOrder(" DESC,");
    }
}
exports.default = FieldSorter;
