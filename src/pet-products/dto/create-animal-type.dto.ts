import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAnimalTypeDto {
  @IsString({ message: 'Назва виду тварини має бути рядком' })
  @IsNotEmpty({ message: 'Назва виду тварини є обовʼязковою' })
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
