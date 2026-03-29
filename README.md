# Cats on Cakes Backend

Backend API для каталога товаров и заявок магазина `Cats on Cakes`.

Проект написан на `Node.js` c использованием `Express`, `Prisma` и `PostgreSQL`.

## Что умеет API

- хранить список товаров
- создавать, обновлять и удалять товары
- хранить заявки клиентов
- создавать и удалять заявки
- отправлять email-уведомление администратору при создании заказа

## Стек

- `Node.js`
- `Express`
- `Prisma`
- `PostgreSQL`
- `pg`
- `Nodemailer`
- `Docker Compose`

## Структура проекта

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── db.js
│   └── index.js
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Модели данных

### Product

Товар содержит:

- `id`
- `title`
- `description`
- `weight`
- `diameter`
- `servings`
- `images`
- `createdAt`
- `updatedAt`

### Order

Заявка содержит:

- `id`
- `name`
- `message`
- `contactType`
- `contactValue`
- `productId`
- `createdAt`

`productId` является необязательным и может ссылаться на товар.

## Переменные окружения

Создай `.env` в корне проекта. Минимально нужны такие переменные:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cats_on_cakes?schema=public"
PORT=3000

SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_USER=your_mail@example.com
SMTP_PASS=your_password
FROM_EMAIL=your_mail@example.com
ADMIN_MAIL=admin@example.com
```

## Запуск локально

### 1. Установить зависимости

```bash
npm install
```

### 2. Поднять PostgreSQL

```bash
docker compose up -d postgres
```

Если нужен сразу весь проект в контейнерах:

```bash
docker compose up --build
```

### 3. Применить миграции

Для разработки:

```bash
npm run db:migrate-dev
```

Для уже созданных миграций:

```bash
npm run db:migrate-prod
```

### 4. Запустить сервер

Режим разработки:

```bash
npm run dev
```

Обычный запуск:

```bash
npm start
```

Сервер по умолчанию стартует на `http://localhost:3000`.

## Docker

В `docker-compose.yml` описаны два сервиса:

- `postgres` для базы данных
- `backend` для Node.js API

Запуск:

```bash
docker compose up --build
```

## API

### Health check

```http
GET /health
```

Возвращает:

```json
{ "status": "ok" }
```

### Products

#### Получить все товары

```http
GET /api/products
```

#### Создать товар

```http
POST /api/products
Content-Type: application/json
```

Пример тела запроса:

```json
{
  "title": "Торт Котик",
  "description": "Бисквитный торт с кремом",
  "weight": 2.5,
  "diameter": 20,
  "servings": 8,
  "images": [
    "https://example.com/cake-1.jpg"
  ]
}
```

#### Обновить товар

```http
PUT /api/products/:id
Content-Type: application/json
```

Можно передавать любые изменяемые поля товара:

```json
{
  "title": "Торт Котик XL",
  "diameter": 24,
  "servings": 10
}
```

#### Удалить товар

```http
DELETE /api/products/:id
```

### Orders

#### Получить все заявки

```http
GET /api/orders
```

#### Создать заявку

```http
POST /api/orders
Content-Type: application/json
```

Пример тела запроса:

```json
{
  "name": "Иван Иванов",
  "message": "Хочу заказать торт к пятнице",
  "contactType": "PHONE",
  "contactValue": "+79991234567",
  "productId": 1
}
```

Допустимые значения `contactType`:

- `PHONE`
- `EMAIL`
- `TELEGRAM`

#### Удалить заявку

```http
DELETE /api/orders/:id
```

## NPM-скрипты

- `npm start` запускает сервер через `node src/index.js`
- `npm run dev` запускает сервер через `nodemon`
- `npm run db:migrate-dev` запускает `prisma migrate dev`
- `npm run db:migrate-prod` запускает `prisma migrate deploy`
- `npm run db:push` запускает `prisma db push`

## Особенности проекта

- Prisma подключается к PostgreSQL через `@prisma/adapter-pg`
- уведомление о новом заказе отправляется из `src/services/emailService.js`
- в `/health` сейчас есть тестовый вызов отправки письма
- при удалении товара связанный `productId` в заказе становится `null`

## Полезные файлы

- `src/index.js` точка входа приложения
- `src/db.js` подключение Prisma к базе
- `src/controllers/productController.js` логика товаров
- `src/controllers/orderController.js` логика заявок
- `src/services/emailService.js` отправка писем
- `prisma/schema.prisma` схема базы данных
