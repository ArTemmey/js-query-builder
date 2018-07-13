declare const defaultExecutor: (method: (entityName: string, selection: string, selectionArgs: (string | null)[], sortOrderLimit: string, resultReader: (result: any[]) => void) => void, entityName: string, outerPrototype?: object | ((item: object) => object) | undefined, innerPrototypes?: {
    [key: string]: object;
} | undefined) => (selection: string, selectionArgs: (string | null)[], sortOrderLimit: string) => Promise<any[]>;
export default defaultExecutor;
