export const getKey = <TObject extends object>(
  obj: TObject,
  value: number,
): string => {
  const index = Object.values(obj).indexOf(value);
  const Key = Object.keys(obj)[index];
  return Key;
};
