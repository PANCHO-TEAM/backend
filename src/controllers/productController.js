import prisma from "../db.js";

// Получаем весь каталог товаров из базы данных.
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

// Создаем новый товар и нормализуем входные значения перед записью в базу.
export const createProduct = async (req, res) => {
  try {
    const { title, description, weight, diameter, servings, images } = req.body;
    console.log(req.body);
    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        weight: parseFloat(weight),
        diameter: parseFloat(diameter),
        servings: parseInt(servings, 10),
        images: images || [],
      },
    });

    console.info(`Product created: ${product.id}`);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Обновляем только те поля товара, которые пришли в запросе.
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, weight, diameter, servings, images } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: title ? title.trim() : undefined,
        description: description ? description.trim() : undefined,
        weight: weight !== undefined ? parseFloat(weight) : undefined,
        diameter: diameter !== undefined ? parseFloat(diameter) : undefined,
        servings: servings !== undefined ? parseInt(servings, 10) : undefined,
        images,
      },
    });

    console.info(`Product updated: ${product.id}`);
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Удаляем товар по его идентификатору.
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    console.info(`Product deleted: ${id}`);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
