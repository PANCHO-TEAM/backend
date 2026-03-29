import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

// Отдельный роутер хранит все HTTP-маршруты, связанные с товарами.
const router = Router();

// Связываем методы и URL с обработчиками контроллера товаров.
router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
