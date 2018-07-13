import { SortOrder } from "./FilterBuilder";
export default class FieldSorter<S extends SortOrder<S>> {
    private readonly _appendOrder;
    asc(): S;
    desc(): S;
    constructor(appendOrder: (edition: string) => S);
}
