"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Executor_1 = require("./Executor");
const FilterInitter_1 = require("./FilterInitter");
class SortOrder extends FilterInitter_1.SortInitter {
    constructor(getCurrentSortOrder) {
        super((fieldName, edition) => {
            this._value += fieldName + edition;
            return getCurrentSortOrder();
        });
        this._value = "";
    }
}
exports.SortOrder = SortOrder;
class FilterBuilder extends FilterInitter_1.default {
    constructor(getCurrentQuery, executeCurrentQuery) {
        super((fieldName, selection, ...args) => {
            this._executor._selection += fieldName + selection;
            this._executor._args = this._executor._args.concat(args);
            return this._executor;
        });
        this._executor = new Executor_1.default(getCurrentQuery, executeCurrentQuery);
    }
    noFilters() {
        this._executor._selection = "";
        this._executor._args = [];
        return this._executor;
    }
}
exports.default = FilterBuilder;
class InnerSortOrder extends FilterInitter_1.SortInitter {
    constructor() {
        super((fieldName, edition) => this._appendInnerOrder(fieldName, edition));
        this._appendInnerOrder = null;
    }
}
exports.InnerSortOrder = InnerSortOrder;
class InnerFilterBuilder extends FilterInitter_1.default {
    constructor() {
        super((fieldName, selection, ...args) => this._appendInnerSelection(fieldName, selection, ...args));
        this._appendInnerSelection = null;
    }
}
exports.InnerFilterBuilder = InnerFilterBuilder;
