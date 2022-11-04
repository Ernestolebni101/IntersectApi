import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfWorkAdapter } from '../../../Database/UnitOfWork/adapter.implements';
import { UserDto } from '../dto/read-user.dto';
import { UsersService } from '../users.service';
import { firebaseProvider } from '../../../Database/database-providers/firebase.provider';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'crypto';
import { userResponse } from '../constants/user.restrictions';
import { UpdateUserDto } from '../dto/update-user.dto';
// import { createMock } from '@golevelup/ts-jest';

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
      // console.log(foundUser);
    });
    it('must return user when set correct uid', async () => {
      const userId = '22ElDR1jt6eT1ON2X1TQw4ohr8A2';
      const foundUser = await userService.findOne(userId);
      expect(foundUser instanceof UserDto).toBeTruthy();
      // console.log(foundUser);
    });
    it('must return an array of user if the database contains data', async () => {
      const foundUsers: UserDto[] = await userService.findAllAsync();
      const foundBynickName = foundUsers.filter((u) => u.nickName === 'Elune');
      console.log(`Ocurrencias encontradas: ${foundBynickName.length}`);
      expect(foundUsers != null).toBeTruthy();
    });
  });
  describe('Mutable Operations (Create and Update)', () => {
    it('**** Create Method **** wouldn`t create an user with the existing nickName', async () => {
      const mockUser = {
        uid: randomUUID(),
        firstName: 'Vladimir',
        lastName: 'Putin',
        phoneNumber: '8472-5561',
        profilePic: '',
        email: 'vladimir@gmail.com',
        nickName: 'Elune',
        token: randomUUID(),
        onlineStatus: true,
      } as CreateUserDto;
      expect(await userService.create(mockUser)).toEqual(
        userResponse.userExist,
      );
    });
    it('**** updated Method **** must failed when set unknown UID', async () => {
      const mockUpdateUser = {
        uid: randomUUID(),
        firstName: 'Vladimir',
        lastName: 'Putin',
        phoneNumber: '8472-5561',
        profilePic: '',
        email: 'vladimir@gmail.com',
        nickName: 'Elune',
        token: randomUUID(),
        onlineStatus: false,
      } as UpdateUserDto;
      expect(await userService.update().toEqual(
        userResponse.userExist,
      );
    });
  });
});
