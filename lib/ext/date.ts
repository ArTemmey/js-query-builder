const padLeft = (source: number) => {
    const len = (String(10).length - String(source).length) + 1;
    return len > 0 ? new Array(len).join('0') + source : source;
};

export const formatDate = (source: Date) =>
    [
        source.getFullYear(),
        padLeft(source.getMonth() + 1),
        padLeft(source.getDate())
    ].join('-') + ' ' + [
        padLeft(source.getHours()),
        padLeft(source.getMinutes()),
        padLeft(source.getSeconds())
    ].join(':');