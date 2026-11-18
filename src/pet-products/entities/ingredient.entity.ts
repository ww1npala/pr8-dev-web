import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PetProductEntity } from './pet-product.entity';

@Entity('ingredients')
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  name: string;

  @ManyToMany(() => PetProductEntity, (product) => product.ingredients)
  products: PetProductEntity[];
}
