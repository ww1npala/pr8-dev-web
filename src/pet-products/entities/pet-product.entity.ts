import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AnimalTypeEntity } from './animal-type.entity';
import { IngredientEntity } from './ingredient.entity';

@Entity('pet_products')
export class PetProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 80 })
  brand: string;

  @ManyToOne(() => AnimalTypeEntity, (animalType) => animalType.products, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'animal_type_id' })
  animalType: AnimalTypeEntity;

  @ManyToMany(() => IngredientEntity, (ingredient) => ingredient.products, {
    cascade: true,
  })
  @JoinTable({
    name: 'pet_product_ingredients',
    joinColumn: { name: 'pet_product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ingredient_id', referencedColumnName: 'id' },
  })
  ingredients: IngredientEntity[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
