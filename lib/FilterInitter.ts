import Executor from "./Executor";
import {SortOrder} from "./FilterBuilder";
import FieldFilter from "./FieldFilter";
import FieldSorter from "./FieldSorter";

export class SortInitter<S extends SortOrder<S>> {

    private readonly _appendFieldOrder: (fieldName: string, edition: string) => S;

    constructor(appendFieldOrder: (fieldName: string, edition: string) => S) {
        this._appendFieldOrder = appendFieldOrder;
    }

    addFieldSorter(fieldName: string): FieldSorter<S> {
        return new FieldSorter<S>(
            (edition) => this._appendFieldOrder(fieldName, edition)
        )
    }

    addInnerSortOrder<T>(target: T): T {
        target._appendInnerOrder = (fieldName: string, edition: string) =>
            this._appendFieldOrder(fieldName, edition);
        return target;
    }

}

export default class FilterInitter<Q, S extends SortOrder<S>, R> {

    private readonly _appendFieldSelection: (fieldName: string,
                                             selection: string,
                                             ...args: Array<(string | null)>) => Executor<Q, S, R>;

    constructor(appendFieldSelection: (fieldName: string,
                                       selection: string,
                                       ...args: Array<(string | null)>) => Executor<Q, S, R>) {
        this._appendFieldSelection = appendFieldSelection;
    }

    addFieldFilter<V>(fieldName: string, typeConverter?: (value: V) => any): FieldFilter<V, Q, S, R> {
        return new FieldFilter<V, Q, S, R>(
            (selection, ...args) => this._appendFieldSelection(fieldName, selection, ...args),
            typeConverter
        );
    }

    addInnerFilterBuilder<T>(target: T): T {
        target._appendInnerSelection = (fieldName: string,
                                        selection: string,
                                        ...args: Array<(string | null)>) =>
            this._appendFieldSelection(fieldName, selection, ...args);
        return target;
    }


}