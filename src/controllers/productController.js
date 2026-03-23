import prisma from "../db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, weight, images } = req.body;
    console.log(req.body);
    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        weight: parseFloat(weight),
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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, weight, images } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: title ? title.trim() : undefined,
        description: description ? description.trim() : undefined,
        weight: weight !== undefined ? parseFloat(weight) : undefined,
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
