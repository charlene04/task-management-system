import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { LiveDataService } from '../websocket/websocket.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly liveDataService: LiveDataService,
  ) {}

  //Helper method
  private get user(): User {
    return this.request.user as User;
  }

  /**
   * Method to return all tasks created by the logged in user
   * @returns Task[] and publishes web socket event
   */
  async findAll(): Promise<Task[]> {
    try {
      const tasks = await this.taskRepo.find({
        where: {
          user: {
            id: this.user.id,
          },
        },
      });

      this.sendLiveData();

      return tasks;
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Method to return one task of a particular ID created by the logged in user
   * @returns Task
   */
  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.taskRepo.findOne({
        where: {
          user: {
            id: this.user.id,
          },
          id,
        },
      });

      if (!task) {
        throw new BadRequestException(`Task with id: ${id} not found`);
      }

      return task;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Method to create task
   * @returns Task and publishes websockets event
   */
  async create(data: CreateTaskDto): Promise<Task> {
    try {
      const { title, description, priority } = data;

      const taskExists = await this.taskRepo.findOne({
        where: {
          title,
          user: {
            id: this.user.id,
          },
        },
      });

      if (taskExists) {
        throw new BadRequestException(
          `Task with title: ${title} already exists.`,
        );
      }

      const taskObj = this.taskRepo.create({
        title,
        description,
        priority,
        user: this.user,
      });
      const res = await this.taskRepo.save(taskObj);

      res.user = undefined;

      this.sendLiveData();

      return res;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Method to update a task of id: id
   * @returns Task and publishes websocket event
   */
  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    try {
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

      this.sendLiveData();

      return updatedTask;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Method to delete task of id: id
   * @returns void and publishes websocket event
   */
  async delete(id: number): Promise<void> {
    try {
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

      this.sendLiveData();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new HttpException(
        'Something went wrong. Try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Helper method triggering websocket publish
  async sendLiveData(user_id = null) {
    const tasks = await this.taskRepo.find({
      where: {
        user: {
          id: user_id || this.user?.id,
        },
      },
    });

    this.liveDataService.streamData(tasks);
  }
}
