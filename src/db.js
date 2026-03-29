import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Получаем строку подключения к базе данных из переменных окружения.
const connectionString = process.env.DATABASE_URL;

// Сразу останавливаем приложение, если строка подключения не задана или имеет неверный тип.
if (!connectionString || typeof connectionString !== "string") {
  throw new Error("DATABASE_URL is not set or is not a string");
}

// Создаем пул соединений PostgreSQL для повторного использования подключений.
const pool = new Pool({ connectionString });

// Подключаем PostgreSQL-адаптер, чтобы Prisma работала через созданный пул.
const adapter = new PrismaPg(pool);

// Инициализируем основной клиент Prisma для выполнения запросов к базе.
const prisma = new PrismaClient({ adapter });

// Экспортируем готовый экземпляр клиента для использования в других модулях приложения.
export default prisma;
