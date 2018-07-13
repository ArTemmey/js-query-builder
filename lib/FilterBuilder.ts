import Executor from "./Executor";
import FilterInitter, {SortInitter} from "./FilterInitter";

export class SortOrder<S extends SortOrder<S>> extends SortInitter<S> {

    private _value = "";

    constructor(getCurrentSortOrder: () => S) {
        super((fieldName, edition) => {
            this._value += fieldName + edition;
            return getCurrentSortOrder()
        });
    }

}

export default class FilterBuilder<Q, S extends SortOrder<S>, R> extends FilterInitter<Q, S, R> {

    private readonly _executor: Executor<Q, S, R>;

    constructor(getCurrentQuery: () => Q,
                executeCurrentQuery: (selection: (string | null),
                                      selectionArgs: (Array<(string | null)> | null),
                                      sortOrderLimit: (string | null)) => Promise<R[]>) {
        super((fieldName, selection, ...args) => {
            this._executor._selection += fieldName + selection;
            this._executor._args = this._executor._args.concat(args);
            return this._executor
        });
        this._executor = new Executor<Q, S, R>(getCurrentQuery, executeCurrentQuery);
    }

    noFilters(): Executor<Q, S, R> {
        this._executor._selection = "";
        this._executor._args = [];
        return this._executor
    }

}

export class InnerSortOrder<S extends SortOrder<S>> extends SortInitter<S> {

    private _appendInnerOrder: ((fieldName: string, edition: string) => S) | null = null;

    constructor() {
        super((fieldName, edition) => this._appendInnerOrder(fieldName, edition));
    }

}

export class InnerFilterBuilder<Q, S extends SortOrder<S>, R> extends FilterInitter<Q, S, R> {

    private _appendInnerSelection: ((fieldName: string,
                                     selection: string,
                                     ...args: Array<(string | null)>) => Executor<Q, S, R>) | null = null;

    constructor() {
        super((fieldName, selection, ...args) => this._appendInnerSelection(fieldName, selection, ...args))
    }

}