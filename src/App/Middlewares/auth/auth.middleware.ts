import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FIREBASE_APP_CLIENT, firebaseClient } from '../../Database/index';
import { Logger } from '@nestjs/common';
import { AppModule } from 'src/App/app.module';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(FIREBASE_APP_CLIENT) private readonly app: firebaseClient,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token || token == '') this.accessDenied(req, res);
    try {
      const decode = await this.app
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''));
      req['user'] = { email: decode };
      next();
    } catch (error) {
      const pass = AppModule.apiKey === token.replace('Bearer ', '');
      if (pass) next();
      else this.accessDenied(req, res);
    }
  }

  private accessDenied(req: Request, res: Response): void {
    const logger = new Logger();
    const path = '\\src\\App\\Middlewares\\auth\\forbiden.html';
    const mss = {
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Access Denied',
    };
    const messageError = `the client ip ${req.ip} trying to access in ${req.url}`;
    logger.error(mss, messageError, AuthMiddleware.name);
    res.status(403).sendFile(process.cwd() + path);
  }
}
