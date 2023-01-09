export enum userResponse {
  notExist = 404,
  userExist = 400,
  userCreated = 201,
}

export const userCtrlresponse = {
  userCreated: 'Usuario Creado Exitosamente',
  userExist: 'Este nombre de usuario no está disponible',
};

// export const getKey = (value: userResponse): string => {
//   const index = Object.values(userResponse).indexOf(value);
//   const Key = Object.keys(userResponse)[index];
//   return Key;
// };
