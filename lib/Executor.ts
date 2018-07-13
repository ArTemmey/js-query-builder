import {SortOrder} from "./FilterBuilder";

export default class Executor<Q, S extends SortOrder<S>, R> {

    private readonly _getCurrentQuery: () => Q;
    private _selection: string = "";
    private _args: Array<(string | null)> = [];
    private _limitValue: string = "";
    private _sortOrderValue: string = "";
    private readonly _executeCurrentQuery: (selection: (string | null),
                                            selectionArgs: (Array<(string | null)> | null),
                                            sortOrderLimit: (string | null)) => Promise<R[]>;
    private readonly _intersectionUnion: (operator: string, target: Executor<Q, S, R>) => Executor<Q, S, R>;

    constructor(getCurrentQuery: () => Q,
                executeCurrentQuery: (selection: (string | null),
                                      selectionArgs: (Array<(string | null)> | null),
                                      sortOrderLimit: (string | null)) => Promise<R[]>) {
        this._getCurrentQuery = getCurrentQuery;
        this._executeCurrentQuery = executeCurrentQuery;
        this._intersectionUnion = (operator, target) => {
            if (target._selection.length) {
                const wasNotEmpty = this._selection.length;
                if (wasNotEmpty) {
                    this._selection += " " + operator + " ("
                }
                this._selection += target._selection;
                if (wasNotEmpty) {
                    this._selection += ")"
                }
                this._args = this._args.concat(target._args)
            }
            return this
        }
    }

    intersection(target: Executor<Q, S, R>): Executor<Q, S, R> {
        return this._intersectionUnion("AND", target)
    }

    union(target: Executor<Q, S, R>): Executor<Q, S, R> {
        return this._intersectionUnion("OR", target)
    }

    and(): Q {
        if(this._selection.length) {
            this._selection += " AND "
        }
        return this._getCurrentQuery()
    }

    or(): Q {
        if(this._selection.length) {
            this._selection += " OR "
        }
        return this._getCurrentQuery()
    }

    sortOrder(sortOrder: S): Executor<Q, S, R> {
        this._sortOrderValue = sortOrder._value.slice(0, -1);
        return this
    }

    limit(value: number): Executor<Q, S, R> {
        this._limitValue = " LIMIT " + value.toString();
        return this
    }

    execute(): Promise<R[]> {
        const sortOrderLimit = (this._sortOrderValue.length ? this._sortOrderValue : "ROWID") + this._limitValue;
        return this._executeCurrentQuery(
            this._selection.length ? this._selection : null,
            this._args.length ? this._args : null,
            sortOrderLimit.length ? sortOrderLimit : null
        )
    }

}