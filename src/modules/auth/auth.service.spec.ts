import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/createUserDto';
import { LoginDto } from './dtos/loginDto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a user and return without password', async () => {
      const body: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(body.password, 12);
      const user = {
        ...body,
        password: hashedPassword,
      } as User;

      jest.spyOn(userRepo, 'create').mockReturnValue(user);
      jest.spyOn(userRepo, 'save').mockResolvedValue(user);

      const result = await service.register(body);

      expect(result.email).toEqual(body.email);
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalledWith(user);
    });
  });

  describe('login', () => {
    it('should throw BadRequestException if user is not found', async () => {
      const body: LoginDto = { username: 'testuser', password: 'password123' };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);

      await expect(service.login(body)).rejects.toThrow(
        new BadRequestException('Invalid credentials!'),
      );
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const body: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };
      const user: Partial<User> = {
        id: 1,
        username: 'testuser',
        password: await bcrypt.hash('password123', 12),
        email: 'test@example.com',
        name: 'Test User',
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);

      await expect(service.login(body)).rejects.toThrow(
        new BadRequestException('Invalid credentials!'),
      );
    });

    it('should return JWT if credentials are valid', async () => {
      const body: LoginDto = { username: 'testuser', password: 'password123' };
      const user: Partial<User> = {
        id: 1,
        username: 'testuser',
        password: await bcrypt.hash('password123', 12),
        email: 'test@example.com',
        name: 'Test User',
      };

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user as User);
      const jwt = 'jwt-token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(jwt);

      const result = await service.login(body);

      expect(result).toEqual(jwt);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ id: user.id });
    });
  });
});
