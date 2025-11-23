import { Router } from "express";
import { shipmentController } from "../controllers/shipment.controller";

const router = Router();

// Create shipment
router.post("/", shipmentController.createShipment);

// Confirm receipt of goods
router.post("/:id/confirm", shipmentController.confirmReceipt);

// Get by id
router.get("/:id", shipmentController.getShipmentById);

// Get by tenderId
router.get("/tender/:tenderId", shipmentController.getShipmentsByTender);

// Get by status
router.get("/status/:status", shipmentController.getByStatus);

// Get all shipments
router.get("/", shipmentController.getAll);

export default router;
