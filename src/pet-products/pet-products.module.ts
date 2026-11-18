import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetProductsController } from './pet-products.controller';
import { PetProductsService } from './pet-products.service';
import { PetProductEntity } from './entities/pet-product.entity';
import { AnimalTypeEntity } from './entities/animal-type.entity';
import { IngredientEntity } from './entities/ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PetProductEntity,
      AnimalTypeEntity,
      IngredientEntity,
    ]),
  ],
  controllers: [PetProductsController],
  providers: [PetProductsService],
})
export class PetProductsModule {}
