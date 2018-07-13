declare const resultReader: (resolve: (result: any[]) => void, outerPrototype?: object | ((item: object) => object) | undefined, innerPrototypes?: {
    [key: string]: object;
} | undefined) => (result: any[]) => void;
export default resultReader;
