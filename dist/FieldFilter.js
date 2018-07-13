"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_1 = require("./ext/date");
class FieldFilter {
    constructor(appendSelection, typeConverter) {
        this._appendSelection = appendSelection;
        this._convertArg = (source) => {
            let result = typeConverter ? typeConverter(source) : source;
            if (typeof result === 'boolean') {
                result = result ? "1" : "0";
            }
            else if (result instanceof Date) {
                result = date_1.formatDate(result);
            }
            return result ? result.toString() : null;
        };
        this._equalNotEqual = (not, value) => {
            let arg = this._convertArg(value);
            if (arg) {
                let selection = not ? "<>" : "=";
                return this._appendSelection(selection + "?", arg);
            }
            let selection = not ? " NOT" : "";
            return this._appendSelection(" IS" + selection + " NULL");
        };
        this._greaterLower = (operator, value, including) => {
            if (including) {
                operator += "=";
            }
            return this._appendSelection(operator + "?", this._convertArg(value));
        };
        this._insideNotInside = (not, values) => {
            let argsSelection = "";
            const args = [];
            let argsContainNull = false;
            values.forEach((it) => {
                const arg = this._convertArg(it);
                if (arg != null) {
                    if (!args.includes(arg)) {
                        argsSelection += ",?";
                        args.push(arg);
                    }
                }
                else {
                    argsContainNull = true;
                }
            });
            if (argsSelection.length) {
                argsSelection = argsSelection.slice(1);
            }
            if (argsContainNull) {
                let selection = not ? " NOT" : "";
                this._appendSelection(" IS" + selection + " NULL");
            }
            let selection = not ? " NOT" : "";
            return this._appendSelection(selection + " IN (" + argsSelection + ")", ...args);
        };
    }
    equal(value) {
        return this._equalNotEqual(false, value);
    }
    notEqual(value) {
        return this._equalNotEqual(true, value);
    }
    greater(value, including) {
        return this._greaterLower(">", value, including);
    }
    lower(value, including) {
        return this._greaterLower("<", value, including);
    }
    like(text, escape) {
        let operator = " LIKE ?";
        if (escape) {
            operator += " ESCAPE '" + escape.toString() + "'";
        }
        return this._appendSelection(operator, text);
    }
    between(leftValue, rightValue) {
        return this._appendSelection(" BETWEEN ? AND ?", this._convertArg(leftValue), this._convertArg(rightValue));
    }
    notBetween(leftValue, rightValue) {
        return this._appendSelection(" NOT BETWEEN ? AND ?", this._convertArg(leftValue), this._convertArg(rightValue));
    }
    inside(values) {
        return this._insideNotInside(false, values);
    }
    notInside(values) {
        return this._insideNotInside(true, values);
    }
}
exports.default = FieldFilter;
