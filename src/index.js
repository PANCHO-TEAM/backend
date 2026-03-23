import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { sendOrderNotification } from "./services/emailService.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health check
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

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
