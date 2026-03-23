import prisma from "../db.js";
import { sendOrderNotification } from "../services/emailService.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();

    res.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { name, message, contactType, contactValue, productId } = req.body;

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
      console.error("Failed to send order notification email:", error);
    });

    console.info(`Order created: ${order.id}`);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id: Number(id) },
    });

    console.info(`Order deleted: ${id}`);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
