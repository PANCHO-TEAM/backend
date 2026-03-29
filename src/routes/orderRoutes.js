import { Router } from 'express';
import {
  getOrders,
  createOrder,
  deleteOrder,
} from '../controllers/orderController.js';

// Отдельный роутер хранит все HTTP-маршруты, связанные с заказами.
const router = Router();

// Связываем методы и URL с обработчиками контроллера заказов.
router.get('/', getOrders);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;
