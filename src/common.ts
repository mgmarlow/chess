export const filterMap = <X, Y>(
  fn: (cur: X, i: number) => Y | undefined,
  lst: X[],
): Y[] =>
  lst.reduce((acc, cur, i) => {
    const result: Y | undefined = fn(cur, i);

    if (result === undefined || result === null) {
      return acc;
    } else {
      acc.push(result);
      return acc;
    }
  }, [] as Y[]);

export const isObject = (value: any) =>
  value != null && (typeof value == "object" || typeof value == "function");
