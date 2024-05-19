import { Controller, Post, Body, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import { AuthService } from './auth.service';
import { ResponseDto } from '../../constant/response.dto';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dtos/loginDto';
import { Response } from 'express';

@Controller(['api/v1/auth'])
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<Omit<User, 'password'>>> {
    const response = await this.authService.register(createUserDto);

    return {
      statusCode: 201,
      message: 'Account created successfully',
      data: response,
    };
  }

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto<undefined>> {
    const jwt = await this.authService.login(data);

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      statusCode: 200,
      message: 'Successfully logged in',
    };
  }
}
