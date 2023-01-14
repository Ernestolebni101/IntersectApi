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

export const messageNotification = {
  0: (nick: string[], group: string, flag: boolean) => {
    let mss = '';
    switch (flag) {
      case true:
        mss = `has sido suscrito a ${group} 👑, ${nick[0]} se ha unido a tu comunidad 👑`;
        break;
      case false:
        mss = `${nick} te ha dado acceso 🔑 para unirte a ${group}`;
        break;
    }
    return mss;
  },
  1: (group: string) => `has ingresado a ${group} 👑`, // este no
};
