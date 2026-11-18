import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PetProductsService } from './pet-products.service';
import { CreateAnimalTypeDto } from './dto/create-animal-type.dto';
import { CreatePetProductDto } from './dto/create-pet-product.dto';
import { FilterPetProductsDto } from './dto/filter-pet-products.dto';

@Controller()
export class PetProductsController {
  constructor(private readonly petProductsService: PetProductsService) {}

  @Post('animal-types')
  @HttpCode(HttpStatus.CREATED)
  createAnimalType(@Body() dto: CreateAnimalTypeDto) {
    return this.petProductsService.createAnimalType(dto);
  }

  @Get('animal-types')
  findAllAnimalTypes() {
    return this.petProductsService.findAllAnimalTypes();
  }

  @Delete('animal-types/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAnimalType(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.petProductsService.removeAnimalType(id);
  }

  @Post('pet-products')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreatePetProductDto) {
    return this.petProductsService.createProduct(dto);
  }

  @Get('pet-products')
  findAll(@Query() filter: FilterPetProductsDto) {
    return this.petProductsService.findAll(filter);
  }

  @Get('pet-products/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.petProductsService.findOne(id);
  }

  @Delete('pet-products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.petProductsService.removeProduct(id);
  }
}
