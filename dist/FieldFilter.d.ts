import Executor from "./Executor";
import { SortOrder } from "./FilterBuilder";
export default class FieldFilter<V, Q, S extends SortOrder<S>, R> {
    private readonly _convertArg;
    private readonly _appendSelection;
    private readonly _equalNotEqual;
    private readonly _greaterLower;
    private readonly _insideNotInside;
    constructor(appendSelection: (selection: string, ...args: Array<(string | null)>) => Executor<Q, S, R>, typeConverter?: (value: V) => any);
    equal(value: V): Executor<Q, S, R>;
    notEqual(value: V): Executor<Q, S, R>;
    greater(value: V, including?: boolean): Executor<Q, S, R>;
    lower(value: V, including?: boolean): Executor<Q, S, R>;
    like(text: string, escape?: symbol): Executor<Q, S, R>;
    between(leftValue: V, rightValue: V): Executor<Q, S, R>;
    notBetween(leftValue: V, rightValue: V): Executor<Q, S, R>;
    inside(values: V[]): Executor<Q, S, R>;
    notInside(values: V[]): Executor<Q, S, R>;
}
