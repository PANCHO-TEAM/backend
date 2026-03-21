import { Router } from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;
