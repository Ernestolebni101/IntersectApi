export const getKey = <TObject extends object>(
  obj: TObject,
  value: number | string,
): string => {
  const index = Object.values(obj).indexOf(value);
  const Key = Object.keys(obj)[index];
  return Key;
};

export enum cmd {
  CREATE = 0,
  UPDATE = 1,
  DELETE = 2,
}
