import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { SharedJwtModule } from '../shared/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedJwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
