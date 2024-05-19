import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { Task } from '../../entities/task.entity';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';
import { Priority } from '../../constant/enums';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: Priority.HIGH,
    user: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of tasks', async () => {
      const tasks: Task[] = [mockTask as Task];
      jest.spyOn(taskService, 'findAll').mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(result).toEqual({
        statusCode: 200,
        message: 'Tasks fetched successfully',
        data: tasks,
      });
      expect(taskService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        priority: Priority.LOW,
      };
      jest.spyOn(taskService, 'create').mockResolvedValue(mockTask as Task);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Task created successfully',
        data: mockTask,
      });
      expect(taskService.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        priority: Priority.LOW,
      };
      jest
        .spyOn(taskService, 'create')
        .mockRejectedValue(new BadRequestException('Invalid data'));

      await expect(controller.create(createTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      jest.spyOn(taskService, 'findOne').mockResolvedValue(mockTask as Task);

      const result = await controller.findOne(1);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Task fetched successfully',
        data: mockTask,
      });
      expect(taskService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if task not found', async () => {
      jest
        .spyOn(taskService, 'findOne')
        .mockRejectedValue(new BadRequestException('Task not found'));

      await expect(controller.findOne(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update and return the updated task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: Priority.MEDIUM,
      };
      jest
        .spyOn(taskService, 'update')
        .mockResolvedValue({ ...mockTask, ...updateTaskDto } as Task);

      const result = await controller.update(1, updateTaskDto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Task updated successfully',
        data: { ...mockTask, ...updateTaskDto },
      });
      expect(taskService.update).toHaveBeenCalledWith(1, updateTaskDto);
    });

    it('should throw BadRequestException if update fails', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: Priority.MEDIUM,
      };
      jest
        .spyOn(taskService, 'update')
        .mockRejectedValue(new BadRequestException('Task not found'));

      await expect(controller.update(1, updateTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the task and return no content', async () => {
      jest.spyOn(taskService, 'delete').mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(result).toEqual({
        statusCode: 204,
        message: 'Task deleted successfully',
      });
      expect(taskService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if delete fails', async () => {
      jest
        .spyOn(taskService, 'delete')
        .mockRejectedValue(new BadRequestException('Task not found'));

      await expect(controller.delete(1)).rejects.toThrow(BadRequestException);
    });
  });
});
