import AnotherDemoEntity from "./AnotherDemoEntity";

export default class DemoEntity {

    numberField: number;
    stringField: string;
    dateField: Date;
    innerEntity: AnotherDemoEntity;

    constructor(numberField: number, stringField: string, dateField: Date, innerEntity: AnotherDemoEntity) {
        this.numberField = numberField;
        this.stringField = stringField;
        this.dateField = dateField;
        this.innerEntity = innerEntity;
    }

}