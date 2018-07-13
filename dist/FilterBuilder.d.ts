import Executor from "./Executor";
import FilterInitter, { SortInitter } from "./FilterInitter";
export declare class SortOrder<S extends SortOrder<S>> extends SortInitter<S> {
    private _value;
    constructor(getCurrentSortOrder: () => S);
}
export default class FilterBuilder<Q, S extends SortOrder<S>, R> extends FilterInitter<Q, S, R> {
    private readonly _executor;
    constructor(getCurrentQuery: () => Q, executeCurrentQuery: (selection: (string | null), selectionArgs: (Array<(string | null)> | null), sortOrderLimit: (string | null)) => Promise<R[]>);
    noFilters(): Executor<Q, S, R>;
}
export declare class InnerSortOrder<S extends SortOrder<S>> extends SortInitter<S> {
    private _appendInnerOrder;
    constructor();
}
export declare class InnerFilterBuilder<Q, S extends SortOrder<S>, R> extends FilterInitter<Q, S, R> {
    private _appendInnerSelection;
    constructor();
}
