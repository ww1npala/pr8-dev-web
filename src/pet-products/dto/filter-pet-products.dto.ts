import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterPetProductsDto {
  @IsOptional()
  @IsString()
  ingredient?: string;

  @IsOptional()
  @IsUUID('4')
  ingredientId?: string;

  @IsOptional()
  @IsString()
  animalType?: string;
}
