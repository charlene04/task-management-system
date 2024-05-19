import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if token is valid and user is found', async () => {
      const mockRequest = {
        cookies: { jwt: 'valid-token' },
        user: null,
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const mockDecodedToken = { id: mockUser.id };
      jwtService.verify = jest.fn().mockReturnValue(mockDecodedToken);
      userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual(mockUser);
      expect(jwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: process.env.JWT_SECRET,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: mockUser.id,
      });
    });

    it('should throw UnauthorizedException if token is not present', async () => {
      const mockRequest = {
        cookies: {},
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockRequest = {
        cookies: { jwt: 'invalid-token' },
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const mockRequest = {
        cookies: { jwt: 'valid-token' },
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      const mockDecodedToken = { id: mockUser.id };
      jwtService.verify = jest.fn().mockReturnValue(mockDecodedToken);
      userRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
