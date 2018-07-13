import Executor from "./Executor";
import { SortOrder } from "./FilterBuilder";
import FieldFilter from "./FieldFilter";
import FieldSorter from "./FieldSorter";
export declare class SortInitter<S extends SortOrder<S>> {
    private readonly _appendFieldOrder;
    constructor(appendFieldOrder: (fieldName: string, edition: string) => S);
    addFieldSorter(fieldName: string): FieldSorter<S>;
    addInnerSortOrder<T>(target: T): T;
}
export default class FilterInitter<Q, S extends SortOrder<S>, R> {
    private readonly _appendFieldSelection;
    constructor(appendFieldSelection: (fieldName: string, selection: string, ...args: Array<(string | null)>) => Executor<Q, S, R>);
    addFieldFilter<V>(fieldName: string, typeConverter?: (value: V) => any): FieldFilter<V, Q, S, R>;
    addInnerFilterBuilder<T>(target: T): T;
}
