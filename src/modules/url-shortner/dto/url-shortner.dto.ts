import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}