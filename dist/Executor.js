"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Executor {
    constructor(getCurrentQuery, executeCurrentQuery) {
        this._selection = "";
        this._args = [];
        this._limitValue = "";
        this._sortOrderValue = "";
        this._getCurrentQuery = getCurrentQuery;
        this._executeCurrentQuery = executeCurrentQuery;
        this._intersectionUnion = (operator, target) => {
            if (target._selection.length) {
                const wasNotEmpty = this._selection.length;
                if (wasNotEmpty) {
                    this._selection += " " + operator + " (";
                }
                this._selection += target._selection;
                if (wasNotEmpty) {
                    this._selection += ")";
                }
                this._args = this._args.concat(target._args);
            }
            return this;
        };
    }
    intersection(target) {
        return this._intersectionUnion("AND", target);
    }
    union(target) {
        return this._intersectionUnion("OR", target);
    }
    and() {
        if (this._selection.length) {
            this._selection += " AND ";
        }
        return this._getCurrentQuery();
    }
    or() {
        if (this._selection.length) {
            this._selection += " OR ";
        }
        return this._getCurrentQuery();
    }
    sortOrder(sortOrder) {
        this._sortOrderValue = sortOrder._value.slice(0, -1);
        return this;
    }
    limit(value) {
        this._limitValue = " LIMIT " + value.toString();
        return this;
    }
    execute() {
        const sortOrderLimit = (this._sortOrderValue.length ? this._sortOrderValue : "ROWID") + this._limitValue;
        return this._executeCurrentQuery(this._selection.length ? this._selection : null, this._args.length ? this._args : null, sortOrderLimit.length ? sortOrderLimit : null);
    }
}
exports.default = Executor;
