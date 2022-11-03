import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfWorkAdapter } from '../../../Database/UnitOfWork/adapter.implements';
import { UserDto } from '../dto/read-user.dto';
import { UsersService } from '../users.service';
import { createMock } from '@golevelup/ts-jest';
import { firebaseProvider } from '../../../Database/database-providers/firebase.provider';
import { ConfigModule } from '@nestjs/config';
describe('*******UsersService Read Methods********', () => {
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

  describe('findOne and findAllAsync Method', () => {
    it('must return null when set unknown uid', async () => {
      const userId = '22ElDR1jt6eT1ON2X1TQw4ohr8A2ff';
      const foundUser = await userService.findOne(userId);
      expect(foundUser).toBeNull();
      console.log(foundUser);
    });
    it('must return user when set correct uid', async () => {
      const userId = '22ElDR1jt6eT1ON2X1TQw4ohr8A2';
      const foundUser = await userService.findOne(userId);
      expect(foundUser instanceof UserDto).toBeTruthy();
      console.log(foundUser);
    });
    it('must return an array of user if the database contains data', async () => {
      const foundUsers: UserDto[] = await userService.findAllAsync();
      expect(foundUsers != null).toBeTruthy();
    });
  });
  describe('findAllAsync Method', () => {
    it('must return null when set unknown uid', async () => {
      const expectedResponse = {} as UserDto[];
      const foundUsers = await userService.findAllAsync();
      expect(foundUsers).toEqual<UserDto[]>(expectedResponse);
      console.log(foundUsers);
    });
  });
});
