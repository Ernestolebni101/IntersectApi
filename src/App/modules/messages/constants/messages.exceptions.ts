export const messageException = {
  missingReceptors: () => {
    throw new Error('Tokens Indefinidos');
  },
  missingSettings: () => {
    throw new Error(
      'El grupo no contiene Configuraciones de usuario Indefinidos',
    );
  },
};
