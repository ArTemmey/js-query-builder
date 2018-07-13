import resultReader from "./resultReader";

const defaultExecutor = (method: (entityName: string,
                                  selection: string,
                                  selectionArgs: Array<(string | null)>,
                                  sortOrderLimit: string,
                                  resultReader: (result: any[]) => void) => void,
                         entityName: string,
                         outerPrototype?: (object | ((item: object) => object)),
                         innerPrototypes?: { [key: string]: object }): (selection: string,
                                                                        selectionArgs: Array<(string | null)>,
                                                                        sortOrderLimit: string) => Promise<any[]> =>
    (selection, selectionArgs, sortOrderLimit) =>
        new Promise(resolve =>
            method(
                entityName,
                selection,
                selectionArgs,
                sortOrderLimit,
                resultReader(resolve, outerPrototype, innerPrototypes)
            )
        );

export default defaultExecutor;