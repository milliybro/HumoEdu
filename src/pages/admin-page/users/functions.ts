// functions.ts

export const patchChanges = (originalData, newData) => {
  if (!originalData) return newData;

  const patchedData = {};

  Object.keys(newData).forEach((key) => {
    if (typeof newData[key] === "object" && newData[key] !== null) {
      // Recursively compare nested objects
      const nestedChanges = patchChanges(originalData[key], newData[key]);
      if (Object.keys(nestedChanges).length > 0) {
        patchedData[key] = nestedChanges;
      }
    } else if (originalData[key] !== newData[key]) {
      patchedData[key] = newData[key];
    }
  });

  return patchedData;
};

export const removeNullish = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] != null) {
      // Check for both null and undefined
      newObj[key] = obj[key];
    }
  });

  return newObj;
};
