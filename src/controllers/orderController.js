import prisma from '../db.js';
import { sendOrderNotification } from '../services/emailService.js';

export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const orderBy = { [sortBy]: order };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        orderBy,
        include: { product: true },
      }),
      prisma.order.count(),
    ]);

    res.json({
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    req.log.error('Error getting orders:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    req.log.error('Error getting order:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { name, message, contactType, contactValue, productId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!contactType || !['PHONE', 'EMAIL', 'TELEGRAM'].includes(contactType)) {
      return res.status(400).json({ error: 'Invalid contact type. Must be PHONE, EMAIL, or TELEGRAM' });
    }
    if (!contactValue || !contactValue.trim()) {
      return res.status(400).json({ error: 'Contact value is required' });
    }

    const order = await prisma.order.create({
      data: {
        name: name.trim(),
        message: message.trim(),
        contactType,
        contactValue: contactValue.trim(),
        productId: productId || null,
      },
      include: { product: true },
    });

    // Отправляем уведомление администратору (асинхронно, не блокируя ответ)
    sendOrderNotification(order, order.product).catch((error) => {
      req.log.error('Failed to send order notification email:', error);
    });

    req.log.info(`Order created: ${order.id}`);
    res.status(201).json(order);
  } catch (error) {
    req.log.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id },
    });

    req.log.info(`Order deleted: ${id}`);
    res.status(204).send();
  } catch (error) {
    req.log.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
