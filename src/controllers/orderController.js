import prisma from "../db.js";
import { sendOrderNotification } from "../services/emailService.js";

// Получаем все заказы из базы данных и отправляем их клиенту.
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();

    res.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

// Создаем заказ, сохраняем его в базе и запускаем отправку уведомления администратору.
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

    // Отправляем письмо асинхронно, чтобы уведомление не задерживало ответ API.
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

// Удаляем заказ по идентификатору, переданному в URL.
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
