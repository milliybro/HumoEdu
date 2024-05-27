function patchChanges(
  record: Record<string, unknown>,
  data: Record<string, unknown>
): Record<string, unknown> {
  const resultSet: Record<string, unknown> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const recordValue = record[key];

    if (isObj(value)) {
      resultSet[key] = patchChanges(
        record[key] as Record<string, unknown>,
        data[key] as Record<string, unknown>
      );
    } else {
      if (value !== recordValue) {
        resultSet[key] = value;
      }
    }
  });

  return resultSet;
}

function removeNullish(obj: Record<string, unknown>) {
  const result: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    const val = obj[key];

    if (isObj(val)) {
      result[key] = removeNullish(val);
    } else {
      if (typeof val !== "undefined" && val !== null) {
        result[key] = val;
      }
    }
  });

  return result;
}

const isObj = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null;

export { removeNullish, patchChanges };
