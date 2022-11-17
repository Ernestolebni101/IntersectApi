import { Logger } from '@nestjs/common';
import { MessageListener } from '../handlers/message.listener';

export const messageException = {
  missingReceptors: () => {
    const logger = new Logger();
    logger.warn(
      'El grupo no contiene receptores para la notificación de mensaje',
      MessageListener.name,
    );
  },
  missingSettings: () => {
    const logger = new Logger();
    logger.warn(
      'El grupo no contiene configuraciones por usuario',
      MessageListener.name,
    );
  },
};
