import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/App/modules/users/users.service';
import { UserDto } from 'src/App/modules/users/dto/read-user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user);
  }
  async deserializeUser(user: any, done: (err: Error, user: any) => void) {
    const { token, email, onlineStatus, lastName, id, ...rest } =
      await this.userService.findOne(user.username);
    console.log(user);
    console.log(rest);
    return rest ? done(null, rest) : done(null, null);
  }
}

// current url = https://www.youtube.com/watch?v=_L225zpUK0M  Minuto 25 14
