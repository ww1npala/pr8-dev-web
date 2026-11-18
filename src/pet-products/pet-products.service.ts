import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetProductEntity } from './entities/pet-product.entity';
import { AnimalTypeEntity } from './entities/animal-type.entity';
import { IngredientEntity } from './entities/ingredient.entity';
import { CreateAnimalTypeDto } from './dto/create-animal-type.dto';
import { CreatePetProductDto } from './dto/create-pet-product.dto';
import { FilterPetProductsDto } from './dto/filter-pet-products.dto';

@Injectable()
export class PetProductsService {
  constructor(
    @InjectRepository(PetProductEntity)
    private readonly petProductRepo: Repository<PetProductEntity>,
    @InjectRepository(AnimalTypeEntity)
    private readonly animalTypeRepo: Repository<AnimalTypeEntity>,
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepo: Repository<IngredientEntity>,
  ) {}

  async createAnimalType(dto: CreateAnimalTypeDto): Promise<AnimalTypeEntity> {
    const existing = await this.animalTypeRepo.findOneBy({ name: dto.name });
    if (existing) {
      throw new ConflictException(`Вид тварини "${dto.name}" вже існує`);
    }
    const animalType = this.animalTypeRepo.create(dto);
    return await this.animalTypeRepo.save(animalType);
  }

  async findAllAnimalTypes(): Promise<AnimalTypeEntity[]> {
    return await this.animalTypeRepo.find({
      relations: ['products'],
    });
  }

  async removeAnimalType(id: string): Promise<void> {
    const animalType = await this.animalTypeRepo.findOneBy({ id });
    if (!animalType) {
      throw new NotFoundException(`Вид тварини з ID ${id} не знайдено`);
    }
    await this.animalTypeRepo.remove(animalType);
  }

  async createProduct(dto: CreatePetProductDto): Promise<PetProductEntity> {
    let animalType: AnimalTypeEntity | undefined;
    if (dto.animalTypeId) {
      animalType = await this.animalTypeRepo.findOneBy({ id: dto.animalTypeId });
      if (!animalType) {
        throw new NotFoundException(
          `Вид тварини з ID ${dto.animalTypeId} не знайдено`,
        );
      }
    }

    const ingredientEntities: IngredientEntity[] = [];
    if (dto.ingredients && dto.ingredients.length > 0) {
      for (const rawName of dto.ingredients) {
        const name = rawName.trim();
        let ingredient = await this.ingredientRepo.findOneBy({ name });
        if (!ingredient) {
          ingredient = this.ingredientRepo.create({ name });
        }
        ingredientEntities.push(ingredient);
      }
    }

    const product = this.petProductRepo.create({
      title: dto.title,
      price: dto.price,
      brand: dto.brand,
      animalType,
      ingredients: ingredientEntities,
    });

    const saved = await this.petProductRepo.save(product);
    return await this.findOne(saved.id);
  }

  async findAll(filter: FilterPetProductsDto): Promise<PetProductEntity[]> {
    const query = this.petProductRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.animalType', 'animalType')
      .leftJoinAndSelect('product.ingredients', 'ingredient')
      .orderBy('product.createdAt', 'DESC');

    if (filter.ingredient) {
      query.andWhere('LOWER(ingredient.name) = LOWER(:ingredientName)', {
        ingredientName: filter.ingredient.trim(),
      });
    }

    if (filter.ingredientId) {
      query.andWhere('ingredient.id = :ingredientId', {
        ingredientId: filter.ingredientId,
      });
    }

    if (filter.animalType) {
      query.andWhere('LOWER(animalType.name) = LOWER(:animalTypeName)', {
        animalTypeName: filter.animalType.trim(),
      });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<PetProductEntity> {
    const product = await this.petProductRepo.findOne({
      where: { id },
      relations: ['animalType', 'ingredients'],
    });

    if (!product) {
      throw new NotFoundException(`Зоотовар з ID ${id} не знайдено`);
    }

    return product;
  }

  async removeProduct(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.petProductRepo.remove(product);
  }
}
