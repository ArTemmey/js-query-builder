import { SortOrder } from "./FilterBuilder";
export default class Executor<Q, S extends SortOrder<S>, R> {
    private readonly _getCurrentQuery;
    private _selection;
    private _args;
    private _limitValue;
    private _sortOrderValue;
    private readonly _executeCurrentQuery;
    private readonly _intersectionUnion;
    constructor(getCurrentQuery: () => Q, executeCurrentQuery: (selection: (string | null), selectionArgs: (Array<(string | null)> | null), sortOrderLimit: (string | null)) => Promise<R[]>);
    intersection(target: Executor<Q, S, R>): Executor<Q, S, R>;
    union(target: Executor<Q, S, R>): Executor<Q, S, R>;
    and(): Q;
    or(): Q;
    sortOrder(sortOrder: S): Executor<Q, S, R>;
    limit(value: number): Executor<Q, S, R>;
    execute(): Promise<R[]>;
}
