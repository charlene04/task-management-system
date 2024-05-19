import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/createUserDto';
import { LoginDto } from './dtos/loginDto';
import { ResponseDto } from '../../constant/response.dto';
import { User } from '../../entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and return response', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const user = {
        id: 1,
        ...createUserDto,
        password: undefined,
      } as User;

      jest.spyOn(authService, 'register').mockResolvedValue(user);

      const result: ResponseDto<Omit<User, 'password'>> =
        await controller.register(createUserDto);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Account created successfully',
        data: user,
      });
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException if registration fails', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'invalid-email',
        username: 'testuser',
        password: 'password123',
      };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new BadRequestException('Invalid data'));

      await expect(controller.register(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should log in a user and set JWT in cookies', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const jwt = 'jwt-token';

      jest.spyOn(authService, 'login').mockResolvedValue(jwt);

      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result: ResponseDto<undefined> = await controller.login(
        loginDto,
        response,
      );

      expect(response.cookie).toHaveBeenCalledWith('jwt', jwt, {
        httpOnly: true,
      });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Successfully logged in',
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw BadRequestException if login fails', async () => {
      const loginDto: LoginDto = {
        username: 'invaliduser',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new BadRequestException('Invalid credentials'));

      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      await expect(controller.login(loginDto, response)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
