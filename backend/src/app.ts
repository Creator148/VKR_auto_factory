import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db/config";
import "./models"; 
import workflowRoutes from "./routes/workflow.routes";
import tenderRoutes from "./routes/tender.routes";
import shipmentRoutes from "./routes/shipment.routes";
import paymentRoutes from "./routes/payment.routes";
import bidRoutes from "./routes/bid.routes";
import supplierRoutes from "./routes/supplier.routes";
import explorerRoutes from "./routes/explorer.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/tenders", tenderRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/explorer", explorerRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✔ Database connection established");
    
    await sequelize.sync({ alter: true });
    console.log("✔ Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();

export default app;
