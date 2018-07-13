"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const padLeft = (source) => {
    const len = (String(10).length - String(source).length) + 1;
    return len > 0 ? new Array(len).join('0') + source : source;
};
exports.formatDate = (source) => [
    source.getFullYear(),
    padLeft(source.getMonth() + 1),
    padLeft(source.getDate())
].join('-') + ' ' + [
    padLeft(source.getHours()),
    padLeft(source.getMinutes()),
    padLeft(source.getSeconds())
].join(':');
