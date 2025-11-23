import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db/config";

// Роуты (мы создадим файлы позже)
import tenderRoutes from "./routes/tender.routes";
import shipmentRoutes from "./routes/shipment.routes";
import paymentRoutes from "./routes/payment.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tenders", tenderRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/payments", paymentRoutes);

// Start server only after DB connection is OK
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✔ Database connection established");

    await sequelize.sync({ alter: true });
    console.log("✔ Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
