-- AddColumns
-- Возвращаем поля diameter и servings обратно в таблицу товаров.
ALTER TABLE "Product"
ADD COLUMN "diameter" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "servings" INTEGER NOT NULL DEFAULT 0;

-- CopyData
-- Переносим значения из отдельной таблицы обратно в таблицу товаров.
UPDATE "Product" AS p
SET
  "diameter" = pid."diameter",
  "servings" = pid."servings"
FROM "ProductInputData" AS pid
WHERE pid."productId" = p."id";

-- DropForeignKey
-- Удаляем внешний ключ перед удалением отдельной таблицы.
ALTER TABLE "ProductInputData"
DROP CONSTRAINT "ProductInputData_productId_fkey";

-- DropTable
-- Удаляем отдельную таблицу после переноса данных.
DROP TABLE "ProductInputData";
