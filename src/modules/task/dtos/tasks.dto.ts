/* eslint-disable prettier/prettier */
import { Priority } from '../../../constant/enums';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s_-]+$/, {
    message:
      'Task name should only contain letters, numbers, spaces, dashes and underscores.',
  })
  title: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s_-]+$/, {
    message:
      'Task description should only contain letters, numbers, spaces, dashes and underscores.',
  })
  description?: string;

  @IsNotEmpty()
  @IsEnum(Priority, { message: 'Invalid task priority: high | medium | low' })
  priority: Priority;
}


export class UpdateTaskDto extends CreateTaskDto {}
