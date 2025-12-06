import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";

const router = Router();

// Deposit funds into escrow
router.post("/:tenderId/deposit", paymentController.deposit);

// Release payment from escrow
router.post("/:tenderId/release", paymentController.release);

// Refund payment
router.post("/:tenderId/refund", paymentController.refund);

// Get escrow for tender
router.get("/:tenderId/escrow", paymentController.getEscrow);

// Get all payments of tender
router.get("/tender/:tenderId", paymentController.getByTender);

// Get single payment
router.get("/:id", paymentController.getOne);

// Get all payments
router.get("/", paymentController.getAll);

export default router;
