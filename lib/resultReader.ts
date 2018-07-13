const [YEAR, MONTH, DAY, HOURS, MINUTES, SECONDS] = [0, 1, 2, 0, 1, 2];

const resultReader = (resolve: (result: any[]) => void,
                      outerPrototype?: (object | ((item: object) => object)),
                      innerPrototypes?: { [key: string]: object }): (result: any[]) => void =>
    result => {
        result.forEach(
            (item, i) => {
                if (item) {
                    for (let prop in item) {
                        if (item.hasOwnProperty(prop)) {
                            if (prop === 'date' || prop.includes('Date')) {
                                const dateTime = item[prop].split(' ');
                                const [date, time] = [dateTime[0].split('-'), dateTime[1].split(':')];
                                result[i][prop] = new Date(
                                    parseInt(date[YEAR]), parseInt(date[MONTH]), parseInt(date[DAY]),
                                    parseInt(time[HOURS]), parseInt(time[MINUTES]), parseInt(time[SECONDS])
                                );
                            } else if (innerPrototypes && Object.keys(innerPrototypes).includes(prop)) {
                                result[i][prop].__proto__ = innerPrototypes[prop];
                            }
                        }
                    }
                    if (outerPrototype) {
                        result[i].__proto__ = typeof outerPrototype === 'function' ? outerPrototype(item) : outerPrototype;
                    }
                }
            }
        );
        resolve(result);
    };

export default resultReader;