import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/App/modules/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, { uid: user.uid });
  }
  async deserializeUser(payload: any, done: (err: Error, user: any) => void) {
    const user = await this.userService.findOne(payload.uid);
    done(null, user);
  }
}

// current url = https://www.youtube.com/watch?v=_L225zpUK0M  Minuto 25 14