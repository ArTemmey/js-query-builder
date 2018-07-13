import {SortOrder} from "./FilterBuilder";

export default class FieldSorter<S extends SortOrder<S>> {

    private readonly _appendOrder: (edition: string) => S;

    asc(): S {
        return this._appendOrder(" ASC,")
    }

    desc(): S {
        return this._appendOrder(" DESC,")
    }

    constructor(appendOrder: (edition: string) => S) {
        this._appendOrder = appendOrder;
    }

}