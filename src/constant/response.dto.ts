import { IsOptional, IsNumber } from 'class-validator';

export class ResponseDto<T> {
  @IsOptional()
  message?: string;

  @IsNumber()
  statusCode: number;

  data?: T;
}
