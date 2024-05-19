import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from '../../entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedJwtModule } from '../shared/jwt.module';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), SharedJwtModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
