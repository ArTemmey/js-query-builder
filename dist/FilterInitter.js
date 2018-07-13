"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FieldFilter_1 = require("./FieldFilter");
const FieldSorter_1 = require("./FieldSorter");
class SortInitter {
    constructor(appendFieldOrder) {
        this._appendFieldOrder = appendFieldOrder;
    }
    addFieldSorter(fieldName) {
        return new FieldSorter_1.default((edition) => this._appendFieldOrder(fieldName, edition));
    }
    addInnerSortOrder(target) {
        target._appendInnerOrder = (fieldName, edition) => this._appendFieldOrder(fieldName, edition);
        return target;
    }
}
exports.SortInitter = SortInitter;
class FilterInitter {
    constructor(appendFieldSelection) {
        this._appendFieldSelection = appendFieldSelection;
    }
    addFieldFilter(fieldName, typeConverter) {
        return new FieldFilter_1.default((selection, ...args) => this._appendFieldSelection(fieldName, selection, ...args), typeConverter);
    }
    addInnerFilterBuilder(target) {
        target._appendInnerSelection = (fieldName, selection, ...args) => this._appendFieldSelection(fieldName, selection, ...args);
        return target;
    }
}
exports.default = FilterInitter;
