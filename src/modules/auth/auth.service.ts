import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/loginDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(body: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { password, name, email, username } = body;
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
  }

  async login(body: LoginDto): Promise<string> {
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

    return jwt;
  }
}
