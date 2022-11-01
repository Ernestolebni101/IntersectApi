import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfWorkAdapter } from '../../../Database/UnitOfWork/adapter.implements';
import { UserDto } from '../dto/read-user.dto';
import { UsersService } from '../users.service';
import { createMock } from '@golevelup/ts-jest';
import { firebaseProvider } from '../../../Database/database-providers/firebase.provider';
import { ConfigModule } from '@nestjs/config';
describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      providers: [...firebaseProvider, UnitOfWorkAdapter, UsersService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  describe('findOne', () => {
    it('must failed when set unknown uid', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockImplementation(() =>
          Promise.resolve([{ name: 'example' }] as unknown as Promise<UserDto>),
        );
    });
  });
});
