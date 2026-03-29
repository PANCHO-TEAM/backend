import "dotenv/config";
import { defineConfig } from "prisma/config";

// Централизованная конфигурация Prisma для схемы, миграций и подключения к базе.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
