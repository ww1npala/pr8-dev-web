import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePetProductsRelations1732000000000
  implements MigrationInterface
{
  name = 'CreatePetProductsRelations1732000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "animal_types" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "description" character varying(255),
        CONSTRAINT "UQ_animal_types_name" UNIQUE ("name"),
        CONSTRAINT "PK_animal_types" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ingredients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(120) NOT NULL,
        CONSTRAINT "UQ_ingredients_name" UNIQUE ("name"),
        CONSTRAINT "PK_ingredients" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pet_products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(150) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "brand" character varying(80) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "animal_type_id" uuid,
        CONSTRAINT "PK_pet_products" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pet_product_ingredients" (
        "pet_product_id" uuid NOT NULL,
        "ingredient_id" uuid NOT NULL,
        CONSTRAINT "PK_pet_product_ingredients" PRIMARY KEY ("pet_product_id", "ingredient_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pet_product_ingredients_product" ON "pet_product_ingredients" ("pet_product_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pet_product_ingredients_ingredient" ON "pet_product_ingredients" ("ingredient_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "pet_products"
      ADD CONSTRAINT "FK_pet_products_animal_type"
      FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "pet_product_ingredients"
      ADD CONSTRAINT "FK_ppi_product"
      FOREIGN KEY ("pet_product_id") REFERENCES "pet_products"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "pet_product_ingredients"
      ADD CONSTRAINT "FK_ppi_ingredient"
      FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pet_product_ingredients" DROP CONSTRAINT "FK_ppi_ingredient"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_product_ingredients" DROP CONSTRAINT "FK_ppi_product"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pet_products" DROP CONSTRAINT "FK_pet_products_animal_type"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_pet_product_ingredients_ingredient"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_pet_product_ingredients_product"`,
    );
    await queryRunner.query(`DROP TABLE "pet_product_ingredients"`);
    await queryRunner.query(`DROP TABLE "pet_products"`);
    await queryRunner.query(`DROP TABLE "ingredients"`);
    await queryRunner.query(`DROP TABLE "animal_types"`);
  }
}
