export const filterMap = <X, Y>(fn: (cur: X) => Y | undefined, lst: X[]): Y[] =>
  lst.reduce((acc, cur) => {
    const result: Y | undefined = fn(cur);

    if (result === undefined || result === null) {
      return acc;
    } else {
      acc.push(result);
      return acc;
    }
  }, [] as Y[]);

export const isObject = (value: any) =>
  value != null && (typeof value == "object" || typeof value == "function");
