/* eslint-disable prettier/prettier */
import { Priority } from 'src/constant/enums';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class TaskRequestDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s_-]+$/, {
    message:
      'Task name should only contain letters, numbers, spaces, dashes and underscores.',
  })
  name: string;

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
