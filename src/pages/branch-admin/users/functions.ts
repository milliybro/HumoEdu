function patchChanges(
  record: Record<string, unknown>,
  data: Record<string, unknown>
): Record<string, unknown> {
  const resultSet: Record<string, unknown> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const recordValue = record ? record[key] : undefined;

    console.log(`Key: ${key}, Value: ${value}, Record Value: ${recordValue}`);

    if (isObj(value)) {
      resultSet[key] = patchChanges(
        (recordValue as Record<string, unknown>) || {},
        value as Record<string, unknown>
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
      result[key] = removeNullish(val as Record<string, unknown>);
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
