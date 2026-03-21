import prisma from '../db.js';

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy = { [sortBy]: order };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    req.log.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    req.log.error('Error getting product:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, weight, images } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!weight || isNaN(parseFloat(weight))) {
      return res.status(400).json({ error: 'Weight is required and must be a number' });
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        weight: parseFloat(weight),
        images: images || [],
      },
    });

    req.log.info(`Product created: ${product.id}`);
    res.status(201).json(product);
  } catch (error) {
    req.log.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, weight, images } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    if (description !== undefined && (!description || !description.trim())) {
      return res.status(400).json({ error: 'Description cannot be empty' });
    }
    if (weight !== undefined && (weight === null || isNaN(parseFloat(weight)))) {
      return res.status(400).json({ error: 'Weight must be a number' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: title ? title.trim() : undefined,
        description: description ? description.trim() : undefined,
        weight: weight !== undefined ? parseFloat(weight) : undefined,
        images,
      },
    });

    req.log.info(`Product updated: ${product.id}`);
    res.json(product);
  } catch (error) {
    req.log.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });

    req.log.info(`Product deleted: ${id}`);
    res.status(204).send();
  } catch (error) {
    req.log.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
