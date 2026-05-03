export const deepClone = (value) => {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
};
