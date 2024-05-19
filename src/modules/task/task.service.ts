import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  private get user(): User {
    return this.request.user as User;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepo.find({
      where: {
        user: {
          id: this.user.id,
        },
      },
    });

    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: {
        user: {
          id: this.user.id,
        },
        id,
      },
    });

    if (!task) {
      throw new BadRequestException(`Task with id ${id} not found`);
    }

    return task;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const { title, description, priority } = data;
    const taskObj = this.taskRepo.create({
      title,
      description,
      priority,
      user: this.user,
    });
    const res = await this.taskRepo.save(taskObj);

    res.user = undefined;

    return res;
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const { title, description, priority } = data;
    const task = await this.taskRepo.findOne({
      where: {
        user: {
          id: this.user.id,
        },
        id,
      },
    });

    if (!task) {
      throw new BadRequestException(`Task with id ${id} not found`);
    }

    await this.taskRepo.update(id, { title, description, priority });
    const updatedTask = await this.taskRepo.findOneBy({ id });

    return updatedTask;
  }

  async delete(id: number): Promise<void> {
    const task = await this.taskRepo.findOne({
      where: {
        user: {
          id: this.user.id,
        },
        id,
      },
    });

    if (!task) {
      throw new BadRequestException(`Task with id ${id} not found`);
    }

    await this.taskRepo.delete(id);
  }
}
