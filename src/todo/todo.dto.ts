import { IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { StatusEnum } from './status.enum';

export class CreateTodoDto {
  @IsString({ message: 'Name must be a string' })
  @Length(3, 10, {
    message: 'Name must be between 3 and 50 characters long',
  })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @Length(10, 255, {
    message: 'Description must be at least 10 characters long',
  })
  description: string;

  @IsOptional()
  @IsEnum(StatusEnum, {
    message: 'Status must be one of the predefined statuses',
  })
  status?: StatusEnum;
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(3, 10, {
    message: 'Name must be between 3 and 50 characters long',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(10, 255, {
    message: 'Description must be at least 10 characters long',
  })
  description?: string;

  @IsOptional()
  @IsEnum(StatusEnum, {
    message: 'Status must be one of the predefined statuses',
  })
  status?: StatusEnum;
}