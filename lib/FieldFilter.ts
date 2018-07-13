import Executor from "./Executor";
import {SortOrder} from "./FilterBuilder";
import {formatDate} from "./ext/date";

export default class FieldFilter<V, Q, S extends SortOrder<S>, R> {

    private readonly _convertArg: (source: V) => (string | null);
    private readonly _appendSelection: (selection: string, ...args: Array<(string | null)>) => Executor<Q, S, R>;
    private readonly _equalNotEqual: (not: boolean, value: V) => Executor<Q, S, R>;
    private readonly _greaterLower: (operator: string, value: V, including?: boolean) => Executor<Q, S, R>;
    private readonly _insideNotInside: (not: boolean, values: V[]) => Executor<Q, S, R>;

    constructor(appendSelection: (selection: string, ...args: Array<(string | null)>) => Executor<Q, S, R>,
                typeConverter?: (value: V) => any) {
        this._appendSelection = appendSelection;
        this._convertArg = (source) => {
            let result: any = typeConverter ? typeConverter(source) : source;
            if (typeof result === 'boolean') {
                result = result ? "1" : "0"
            } else if(result instanceof Date) {
                result = formatDate(result)
            }
            return result ? result.toString() : null
        };
        this._equalNotEqual = (not, value) => {
            let arg = this._convertArg(value);
            if (arg) {
                let selection: string = not ? "<>" : "=";
                return this._appendSelection(selection + "?", arg)
            }
            let selection: string = not ? " NOT" : "";
            return this._appendSelection(" IS" + selection + " NULL")
        };
        this._greaterLower = (operator, value, including) => {
            if (including) {
                operator += "="
            }
            return this._appendSelection(operator + "?", this._convertArg(value))
        };
        this._insideNotInside = (not, values) => {
            let argsSelection = "";
            const args: string[] = [];
            let argsContainNull = false;
            values.forEach(
                (it) => {
                    const arg = this._convertArg(it);
                    if (arg != null) {
                        if (!args.includes(arg)) {
                            argsSelection += ",?";
                            args.push(arg)
                        }
                    } else {
                        argsContainNull = true
                    }
                }
            );
            if (argsSelection.length) {
                argsSelection = argsSelection.slice(1)
            }
            if (argsContainNull) {
                let selection: string = not ? " NOT" : "";
                this._appendSelection(" IS" + selection + " NULL")
            }
            let selection: string = not ? " NOT" : "";
            return this._appendSelection(selection + " IN (" + argsSelection + ")", ...args)
        }
    }

    equal(value: V): Executor<Q, S, R> {
        return this._equalNotEqual(false, value)
    }

    notEqual(value: V): Executor<Q, S, R> {
        return this._equalNotEqual(true, value)
    }

    greater(value: V, including?: boolean): Executor<Q, S, R> {
        return this._greaterLower(">", value, including)
    }

    lower(value: V, including?: boolean): Executor<Q, S, R> {
        return this._greaterLower("<", value, including)
    }

    like(text: string, escape?: symbol): Executor<Q, S, R> {
        let operator: string = " LIKE ?";
        if(escape) {
            operator += " ESCAPE '" + escape.toString() + "'"
        }
        return this._appendSelection(operator, text)
    }

    between(leftValue: V, rightValue: V): Executor<Q, S, R> {
        return this._appendSelection(" BETWEEN ? AND ?", this._convertArg(leftValue), this._convertArg(rightValue))
    }

    notBetween(leftValue: V, rightValue: V): Executor<Q, S, R> {
        return this._appendSelection(" NOT BETWEEN ? AND ?", this._convertArg(leftValue), this._convertArg(rightValue))
    }

    inside(values: V[]): Executor<Q, S, R> {
        return this._insideNotInside(false, values)
    }

    notInside(values: V[]): Executor<Q, S, R> {
        return this._insideNotInside(true, values)
    }

}