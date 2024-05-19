import {
  Controller,
  Param,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { ResponseDto } from '../../constant/response.dto';
import { Task } from '../../entities/task.entity';
import { JwtAuthGuard } from '../shared/jwt-auth.guard';

@Controller(['api/v1/tasks'])
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get() // GET /tasks
  async findAll(): Promise<ResponseDto<Task[]>> {
    const tasks = await this.taskService.findAll();

    return {
      statusCode: 200,
      message: 'Tasks fetched successfully',
      data: tasks,
    };
  }

  @Post() // POST /tasks
  async create(
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
  ): Promise<ResponseDto<Task>> {
    const response = await this.taskService.create(createTaskDto);

    return {
      statusCode: 201,
      message: 'Task created successfully',
      data: response,
    };
  }

  @Get(':id') // GET /tasks/:id
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<Task>> {
    const response = await this.taskService.findOne(id);

    return {
      statusCode: 200,
      message: 'Task fetched successfully',
      data: response,
    };
  }

  @Patch(':id') // PATCH /tasks/:id
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseDto<Task>> {
    const response = await this.taskService.update(id, updateTaskDto);

    return {
      statusCode: 200,
      message: 'Task updated successfully',
      data: response,
    };
  }

  @Delete(':id') // DELETE /tasks/:id
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<undefined>> {
    await this.taskService.delete(id);

    return {
      statusCode: 204,
      message: 'Task deleted successfully',
    };
  }
}
