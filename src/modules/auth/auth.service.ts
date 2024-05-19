import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/loginDto';
import { JwtService } from '@nestjs/jwt';
import { TaskService } from '../task/task.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
    private taskService: TaskService,
  ) {}

  async register(body: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const { password, name, email, username } = body;

      const userExists = await this.userRepo.findOne({
        where: [{ username }, { email }],
      });

      if (userExists) {
        throw new BadRequestException(`Username or email already taken`);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const userObj = this.userRepo.create({
        name,
        username,
        email,
        password: hashedPassword,
      });
      const res = await this.userRepo.save(userObj);
      res.password = undefined;

      return res;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(body: LoginDto): Promise<string> {
    try {
      const { username, password } = body;

      const user = await this.userRepo.findOne({
        where: [{ email: username }, { username }],
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials!');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid credentials!');
      }

      const jwt = await this.jwtService.signAsync({ id: user.id });

      // publish websoket events to connected clients on login
      this.taskService.sendLiveData(user.id);

      return jwt;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
