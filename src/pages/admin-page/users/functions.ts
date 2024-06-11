// functions.ts

export const patchChanges = (originalData: any, newData: any) => {
  if (!originalData) return newData; // If originalData is null or undefined, return newData directly

  const patchedData: any = {};
  Object.keys(newData).forEach((key) => {
    if (originalData[key] !== newData[key]) {
      patchedData[key] = newData[key];
    }
  });
  return patchedData;
};

export const removeNullish = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] != null) { // Check for both null and undefined
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
