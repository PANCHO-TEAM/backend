-- CreateTable
-- Создаем отдельную таблицу для входных параметров товара.
CREATE TABLE "ProductInputData" (
    "id" SERIAL NOT NULL,
    "diameter" DOUBLE PRECISION NOT NULL,
    "servings" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductInputData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- Один товар может иметь только одну запись с входными параметрами.
CREATE UNIQUE INDEX "ProductInputData_productId_key" ON "ProductInputData"("productId");

-- CopyData
-- Переносим уже существующие значения из таблицы товаров в новую таблицу.
INSERT INTO "ProductInputData" ("diameter", "servings", "productId")
SELECT "diameter", "servings", "id"
FROM "Product";

-- DropColumns
-- После переноса удаляем поля из основной таблицы товаров.
ALTER TABLE "Product"
DROP COLUMN "diameter",
DROP COLUMN "servings";

-- AddForeignKey
-- Связываем запись входных данных с товаром и удаляем ее вместе с товаром.
ALTER TABLE "ProductInputData"
ADD CONSTRAINT "ProductInputData_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
