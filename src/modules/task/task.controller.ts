import {
  Controller,
  Param,
  Post,
  Patch,
  Get,
  Delete,
  Body,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskRequestDto } from './dtos';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get() // GET /tasks
  findAll() {
    return this.taskService.findAll();
  }

  @Post() // POST /users
  create(@Body() task: TaskRequestDto) {
    return this.taskService.create();
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id') id: string) {
    return this.taskService.findOne();
  }

  @Patch(':id') // PATCH /users/:id
  update(@Param('id') id: string, @Body() data: TaskRequestDto) {
    return this.taskService.listTasks();
  }

  @Delete(':id') // DELETE /users/:id
  delete(@Param('id') id: string) {
    return this.taskService.deleteTask();
  }
}
