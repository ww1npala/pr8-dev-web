# Практична робота №8

**Тема:** Моделювання зв'язків між сутностями та керування міграціями в TypeORM.

**Варіант 10:** Зоотовари.

**Студент:** Тарновський Артур КН-41

## Мета роботи

Опанувати принципи моделювання реляційних зв'язків між сутностями (`One-to-Many` / `Many-to-One` та `Many-to-Many`) у TypeORM, навчитися конфігурувати `DataSource` і TypeORM CLI для керування міграціями (`migration:generate`, `migration:run`, `migration:revert`), вимкнувши `synchronize: true`, а також реалізувати вибірки зі зв'язаними даними через `relations` та `QueryBuilder`.

## Виконані завдання

### Рівень 1. Базовий (Конфігурація міграцій та зв'язок 1:M / M:1)

- Створено конфігураційний файл `src/database/data-source.ts` для роботи TypeORM CLI поза контекстом сервера.
- Додано npm-скрипти `typeorm`, `migration:generate`, `migration:run` та `migration:revert` у `package.json`.
- Вимкнено автоматичну синхронізацію схеми (`synchronize: false`) у `TypeOrmModule.forRoot()` у файлі `src/app.module.ts`.
- Описано сутність виду тварин `AnimalTypeEntity` (`@OneToMany`) та базову сутність зоотовару `PetProductEntity` (`@ManyToOne` з `@JoinColumn({ name: 'animal_type_id' })` та `onDelete: 'CASCADE'`).
- Згенеровано та застосовано міграцію створення таблиць і зовнішніх ключів через `npm run migration:run`.
- Реалізовано отримання зоотовару за UUID із завантаженням пов'язаних даних через параметр `relations`.

### Рівень 2. Середній (Зв'язок M:N, життєвий цикл міграцій та QueryBuilder)

- Описано сутність інгредієнтів `IngredientEntity` та налаштовано зв'язок `Many-to-Many` у `PetProductEntity` за допомогою декораторів `@ManyToMany()` і `@JoinTable()` (проміжна таблиця `pet_product_ingredients`) з опцією `cascade: true`.
- Перевірено життєвий цикл міграцій: відкат (`npm run migration:revert`) та повторне застосування (`npm run migration:run`).
- Реалізовано фільтрацію зоотоварів за назвою або ідентифікатором інгредієнта та видом тварини через `createQueryBuilder` (`leftJoinAndSelect` та параметризований `andWhere`).

## Використані технології

- Node.js
- TypeScript
- NestJS
- TypeORM (Migrations, Relations, QueryBuilder)
- PostgreSQL 16
- Docker Compose
- Thunder Client

## Перевірка роботи

Роботу зв'язків, міграцій та фільтрації через QueryBuilder перевірено за допомогою Thunder Client:

| Метод | Endpoint | Результат |
|---|---|---|
| POST | `/animal-types` | Створення виду тварини (`AnimalTypeEntity`, `201 Created`) |
| GET | `/animal-types` | Отримання списку видів тварин разом із їхніми товарами (`1:M`) |
| POST | `/pet-products` | Створення зоотовару зі зв'язком `animalTypeId` (`M:1`) та каскадним збереженням інгредієнтів (`M:N`) |
| GET | `/pet-products/:id` | Отримання зоотовару за UUID із вкладеними `animalType` та `ingredients` (`relations`) |
| GET | `/pet-products?ingredient=...` | Фільтрація товарів за інгредієнтом через `QueryBuilder` (`M:N`) |
| GET | `/pet-products?animalType=...` | Фільтрація товарів за видом тварини через `QueryBuilder` (`M:1`) |
| DELETE | `/animal-types/:id` | Каскадне видалення виду тварини та пов'язаних зоотоварів (`onDelete: 'CASCADE'`) |

<img width="1295" height="295" alt="image" src="https://github.com/user-attachments/assets/878ef4fb-adf6-4be7-b7fc-e54b49d8dd1e" />
<img width="1298" height="597" alt="image" src="https://github.com/user-attachments/assets/b95e29e4-aa95-4068-a67b-bb753074271b" />
<img width="1292" height="410" alt="image" src="https://github.com/user-attachments/assets/77d50722-3b76-4c5b-a699-9f9c5cdca907" />
<img width="1289" height="592" alt="image" src="https://github.com/user-attachments/assets/1d1ffd12-766a-4a78-8c7b-e61063e68d1e" />
<img width="1298" height="478" alt="image" src="https://github.com/user-attachments/assets/059a1c65-a19c-4a70-aeb1-39b12ec11f81" />
<img width="1278" height="628" alt="image" src="https://github.com/user-attachments/assets/24223781-4b75-4577-a975-5bc7194e7859" />
<img width="1303" height="426" alt="image" src="https://github.com/user-attachments/assets/9b7ee3e8-ab9c-4831-825c-18c9d0f78468" />

Додатково перевірено:
- Застосування міграції командою `npm run migration:run` зі створенням таблиць `animal_types`, `ingredients`, `pet_products` та асоціативної таблиці `pet_product_ingredients`.
- Відкат останньої міграції командою `npm run migration:revert` та її повторне застосування.
- Каскадне створення нових записів у таблиці `ingredients` під час `POST /pet-products`.
<img width="1190" height="703" alt="image" src="https://github.com/user-attachments/assets/8abcf190-8805-4ad6-865e-0ed7ce2f6254" />

## Запуск проєкту

Запуск PostgreSQL:

```bash
docker compose up -d
```

Встановлення залежностей:

```bash
npm install
```

Застосування міграцій бази даних:

```bash
npm run migration:run
```

Перевірка відкату та повторного накату міграцій (за потреби):

```bash
npm run migration:revert
npm run migration:run
```

Запуск NestJS у режимі розробки:

```bash
npm run start:dev
```

Після запуску сервер доступний за адресою:

```text
http://localhost:3000
```

## Висновок

Під час виконання цієї практичної роботи було опановано моделювання реляційних зв'язків `One-to-Many` / `Many-to-One` та `Many-to-Many` у TypeORM, налаштовано керування схемою бази даних PostgreSQL через міграції без використання `synchronize: true`, а також реалізовано фільтрацію зв'язаних сутностей засобами `QueryBuilder`.
