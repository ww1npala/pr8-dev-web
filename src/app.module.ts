import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetProductsModule } from './pet-products/pet-products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nest_user',
      password: 'nest_password',
      database: 'store_pr8_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    PetProductsModule,
  ],
})
export class AppModule {}
