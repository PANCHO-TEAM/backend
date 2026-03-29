import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { sendOrderNotification } from "./services/emailService.js";

import dotenv from "dotenv";
// Загружаем переменные окружения до инициализации приложения.
dotenv.config();

// Создаем экземпляр Express и определяем порт запуска сервера.
const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем приложению принимать JSON в теле запросов.
app.use(express.json());
// Включаем CORS, чтобы API было доступно с фронтенда и внешних клиентов.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Подключаем маршруты для работы с товарами и заказами.
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Технический маршрут для проверки, что сервер отвечает и почтовый сервис доступен.
app.get("/health", (req, res) => {
  sendOrderNotification({
    id: "123",
    name: "John Doe",
    message: "Hello, world!",
    contactType: "PHONE",
    contactValue: "1234567890",
  })
    .then(() => {
      console.log("Notification sent successfully");
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });
  res.json({ status: "ok" });
});

// Единый обработчик неперехваченных ошибок приложения.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Запускаем HTTP-сервер и выводим в консоль используемый порт.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
