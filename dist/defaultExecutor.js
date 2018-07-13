"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resultReader_1 = require("./resultReader");
const defaultExecutor = (method, entityName, outerPrototype, innerPrototypes) => (selection, selectionArgs, sortOrderLimit) => new Promise(resolve => method(entityName, selection, selectionArgs, sortOrderLimit, resultReader_1.default(resolve, outerPrototype, innerPrototypes)));
exports.default = defaultExecutor;
