import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FIREBASE_APP_CLIENT, firebaseClient } from '../../Database/index';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(FIREBASE_APP_CLIENT) private readonly app: firebaseClient,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.app
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decode) => {
          req['user'] = { email: decode };
          next();
        })
        .catch((error) => {
          this.accessDenied(req, res);
        });
    } else this.accessDenied(req, res);
  }

  private accessDenied(req: Request, res: Response): void {
    const logger = new Logger();
    const mss = {
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Access Denied',
    };
    const messageError = `the client ip ${req.ip} trying to access in ${req.url}`;
    logger.error(mss, messageError, AuthMiddleware.name);
    res
      .status(403)
      .sendFile(
        'D:/Source/Information_Sys/Mobile/CurrentProject/Intersect-Api/src/App/Middlewares/auth/static/forbiden.html',
      );
  }
}
