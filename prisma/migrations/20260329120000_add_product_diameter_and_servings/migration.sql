-- AddColumns
-- Добавляем в таблицу товаров диаметр и количество порций.
ALTER TABLE "Product"
ADD COLUMN "diameter" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "servings" INTEGER NOT NULL DEFAULT 0;
