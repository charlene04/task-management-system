import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Priority } from '../../constant/enums';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: Repository<Task>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: REQUEST,
          useValue: {
            user: mockUser,
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks for the user', async () => {
      const tasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          priority: Priority.HIGH,
          user: mockUser,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          priority: Priority.LOW,
          user: mockUser,
        },
      ];

      jest.spyOn(taskRepo, 'find').mockResolvedValue(tasks as Task[]);

      const result = await service.findAll();

      expect(result).toEqual(tasks);
      expect(taskRepo.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
      });
    });
  });

  describe('findOne', () => {
    it('should return the task if found', async () => {
      const task: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        priority: Priority.HIGH,
        user: mockUser,
      };

      jest.spyOn(taskRepo, 'findOne').mockResolvedValue(task);

      const result = await service.findOne(1);

      expect(result).toEqual(task);
      expect(taskRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id }, id: 1 },
      });
    });

    it('should throw BadRequestException if task not found', async () => {
      jest.spyOn(taskRepo, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new BadRequestException('Task with id 1 not found'),
      );
    });
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        priority: Priority.LOW,
      };
      const task: Task = { id: 1, ...createTaskDto, user: mockUser };

      jest.spyOn(taskRepo, 'create').mockReturnValue(task);
      jest.spyOn(taskRepo, 'save').mockResolvedValue(task);

      const result = await service.create(createTaskDto);

      expect(result).toEqual({ ...task, user: undefined });
      expect(taskRepo.create).toHaveBeenCalledWith({
        ...createTaskDto,
        user: mockUser,
      });
      expect(taskRepo.save).toHaveBeenCalledWith(task);
    });
  });

  describe('update', () => {
    it('should update and return the updated task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: Priority.MEDIUM,
      };
      const task: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        priority: Priority.HIGH,
        user: mockUser,
      };

      jest.spyOn(taskRepo, 'findOne').mockResolvedValue(task);
      jest.spyOn(taskRepo, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(taskRepo, 'findOneBy')
        .mockResolvedValue({ ...task, ...updateTaskDto });

      const result = await service.update(1, updateTaskDto);

      expect(result).toEqual({ ...task, ...updateTaskDto });
      expect(taskRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id }, id: 1 },
      });
      expect(taskRepo.update).toHaveBeenCalledWith(1, updateTaskDto);
      expect(taskRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw BadRequestException if task not found', async () => {
      jest.spyOn(taskRepo, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {} as UpdateTaskDto)).rejects.toThrow(
        new BadRequestException('Task with id 1 not found'),
      );
    });
  });

  describe('delete', () => {
    it('should delete the task if found', async () => {
      const task: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        priority: Priority.HIGH,
        user: mockUser,
      };

      jest.spyOn(taskRepo, 'findOne').mockResolvedValue(task);
      jest.spyOn(taskRepo, 'delete').mockResolvedValue(undefined);

      await service.delete(1);

      expect(taskRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id }, id: 1 },
      });
      expect(taskRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if task not found', async () => {
      jest.spyOn(taskRepo, 'findOne').mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(
        new BadRequestException('Task with id 1 not found'),
      );
    });
  });
});
