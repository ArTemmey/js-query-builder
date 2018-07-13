import FilterBuilder, {SortOrder, InnerFilterBuilder, InnerSortOrder} from "../dist/FilterBuilder";
import resultReader from "../dist/resultReader";
import DemoEntity from "./DemoEntity";
import AnotherDemoEntity from "./AnotherDemoEntity";
import any = jasmine.any;

class AnotherDemoEntitySortOrder<S extends SortOrder<S>> extends InnerSortOrder<S> {

    innerField1 = this.addFieldSorter("COLUMN_INNER_FIELD1");
    innerField2 = this.addFieldSorter("COLUMN_INNER_FIELD2");

}

class AnotherDemoEntityFilter<Q extends FilterBuilder<Q, S, R>, S extends SortOrder<S>, R> extends InnerFilterBuilder<Q, S, R> {

    innerField1 = this.addFieldFilter<number>("COLUMN_INNER_FIELD1");
    innerField2 = this.addFieldFilter<string>("COLUMN_INNER_FIELD2");

}


class DemoEntitySortOrder extends SortOrder<DemoEntitySortOrder> {

    numberField = this.addFieldSorter("COLUMN_NUMBER_FIELD");
    stringField = this.addFieldSorter("COLUMN_STRING_FIELD");
    dateField = this.addFieldSorter("COLUMN_DATE_FIELD");
    innerEntity = this.addInnerSortOrder(new AnotherDemoEntitySortOrder<DemoEntitySortOrder>());

    constructor() {
        super(() => this)
    }

}

class DemoEntityQuery extends FilterBuilder<DemoEntityQuery, DemoEntitySortOrder, DemoEntity> {

    numberField = this.addFieldFilter<number>("COLUMN_NUMBER_FIELD");
    stringField = this.addFieldFilter<string>("COLUMN_STRING_FIELD");
    dateField = this.addFieldFilter<Date>("COLUMN_DATE_FIELD");
    innerEntity = this.addInnerFilterBuilder(new AnotherDemoEntityFilter<DemoEntityQuery, DemoEntitySortOrder, DemoEntity>());

    constructor() {
        super(
            () => this,
            (selection, selectionArgs, sortOrderLimit) => new Promise(
                resolve => {

                    expect(selection).toBe("COLUMN_NUMBER_FIELD<? AND COLUMN_INNER_FIELD1 BETWEEN ? AND ? OR (COLUMN_DATE_FIELD=? AND COLUMN_STRING_FIELD LIKE ?)");
                    expect(selectionArgs).toEqual(["10", "1", "3", "2011-12-11 00:00:00", "%CONTAINS THIS VALUE%"]);
                    expect(sortOrderLimit).toBe("COLUMN_NUMBER_FIELD ASC,COLUMN_DATE_FIELD DESC,COLUMN_INNER_FIELD1 ASC LIMIT 10");

                    resultReader(resolve, DemoEntity.prototype, {innerEntity: AnotherDemoEntity.prototype})(
                        [
                            {
                                numberField: 1,
                                stringField: "string field",
                                dateField: "2012-12-12 12:12:12",
                                innerEntity: {innerField1: 2, innerField2: "another string field"}
                            }
                        ]
                    )
                }
            )
        )
    }

}

describe("test query result ", () => {
    it("passes if query is built and the result is read", async () => {
        const result = await new DemoEntityQuery()
            .numberField.lower(10)
            .and().innerEntity.innerField1.between(1, 3)
            .union(new DemoEntityQuery()
                .dateField.equal(new Date(2011, 11, 11))
                .and().stringField.like("%CONTAINS THIS VALUE%"))
            .sortOrder(new DemoEntitySortOrder()
                .numberField.asc()
                .dateField.desc()
                .innerEntity.innerField1.asc())
            .limit(10)
            .execute();
        expect(result[0]).toEqual(any(DemoEntity));
        expect(result[0].innerEntity).toEqual(any(AnotherDemoEntity));
    });
});