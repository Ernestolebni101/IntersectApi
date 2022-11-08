export const getKey = (value: groupEnum): string => {
  const index = Object.values(groupEnum).indexOf(value);
  const Key = Object.keys(groupEnum)[index];
  return Key;
};

export enum groupEnum {
  redirect = 0, // el usuario se encuentra en el grupo
  add = 1, // el usuario no está en el grupo pero es publico
  request = 2, // el grupo es privado,
  createNew = 3, // El grupo no existe
}
