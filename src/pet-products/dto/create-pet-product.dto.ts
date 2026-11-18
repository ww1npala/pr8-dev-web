import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePetProductDto {
  @IsString({ message: 'Назва товару (title) має бути рядком' })
  @IsNotEmpty({ message: 'Назва товару (title) є обовʼязковою' })
  @MaxLength(150)
  title: string;

  @IsNumber({}, { message: 'Ціна (price) має бути числом' })
  @IsPositive({ message: 'Ціна (price) повинна бути більшою за 0' })
  price: number;

  @IsString({ message: 'Бренд (brand) має бути рядком' })
  @IsNotEmpty({ message: 'Бренд (brand) є обовʼязковим' })
  @MaxLength(80)
  brand: string;

  @IsOptional()
  @IsUUID('4', { message: 'animalTypeId має бути валідним UUID' })
  animalTypeId?: string;

  @IsOptional()
  @IsArray({ message: 'ingredients має бути масивом назв інгредієнтів' })
  @IsString({ each: true })
  ingredients?: string[];
}
