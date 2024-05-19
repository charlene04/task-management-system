import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { SharedModule } from '../shared/shared.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule, TaskModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
