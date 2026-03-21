# Cats on Cakes Backend

Backend API для хранения заявок и карточек товаров.

## Стек

- **Runtime:** Node.js 20+
- **Фреймворк:** Express
- **ORM:** Prisma
- **БД:** PostgreSQL (Docker)
- **Логирование:** Pino

## Быстрый старт

### 1. Запуск базы данных

```bash
docker compose up -d
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Применение миграций

```bash
npm run db:migrate
```

### 4. Заполнение тестовыми данными

```bash
npm run db:seed
```

### 5. Запуск сервера

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Products (Товары)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/products` | Список товаров (с пагинацией и фильтрацией) |
| GET | `/api/products/:id` | Детальная информация о товаре |
| POST | `/api/products` | Создание товара |
| PUT | `/api/products/:id` | Обновление товара |
| DELETE | `/api/products/:id` | Удаление товара |

#### Параметры для GET /api/products

- `page` — номер страницы (по умолчанию: 1)
- `limit` — количество записей (по умолчанию: 10, макс: 100)
- `search` — поиск по названию и описанию
- `sortBy` — поле для сортировки (по умолчанию: createdAt)
- `order` — порядок сортировки: `asc` или `desc` (по умолчанию: desc)

### Orders (Заявки)

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/orders` | Список заявок (с пагинацией) |
| GET | `/api/orders/:id` | Детальная информация о заявке |
| POST | `/api/orders` | Создание заявки |
| DELETE | `/api/orders/:id` | Удаление заявки |

#### Параметры для GET /api/orders

- `page` — номер страницы (по умолчанию: 1)
- `limit` — количество записей (по умолчанию: 10, макс: 100)
- `sortBy` — поле для сортировки (по умолчанию: createdAt)
- `order` — порядок сортировки: `asc` или `desc` (по умолчанию: desc)

## Примеры запросов

### Создание товара

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Торт Котик",
    "description": "Вкусный торт с изображением котика",
    "weight": 2.5,
    "images": ["https://example.com/image1.jpg"]
  }'
```

### Создание заявки

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "message": "Хочу заказать торт",
    "contactType": "PHONE",
    "contactValue": "+79991234567",
    "productId": "cm1234567890"
  }'
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте при необходимости:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cats_on_cakes?schema=public"
PORT=3000
LOG_LEVEL=info
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm start` | Запуск в продакшен режиме |
| `npm run db:migrate` | Применение миграций |
| `npm run db:seed` | Заполнение тестовыми данными |
| `npm run db:studio` | Запуск Prisma Studio |

## Структура проекта

```
backend/
├── prisma/
│   ├── schema.prisma      # Схема БД
│   ├── seed.ts            # Seed-данные
│   └── migrations/        # Миграции
├── src/
│   ├── controllers/       # Контроллеры
│   ├── routes/            # Маршруты
│   ├── middleware/        # Middleware
│   ├── db.js              # Подключение к БД
│   └── index.js           # Точка входа
├── docker-compose.yml     # Docker конфигурация
├── .env                   # Переменные окружения
├── .env.example           # Шаблон переменных
└── package.json
```
