import { Router } from "express";
import { bidController } from "../controllers/bid.controller";

const router = Router();

// Get bid by id
router.get("/:id", bidController.getOne);

// Get all bids of tender
router.get("/tender/:tenderId", bidController.getByTender);

// Get all bids of supplier
router.get("/supplier/:supplierId", bidController.getBySupplier);

// Update a bid
router.put("/:id", bidController.updateBid);

// Delete a bid
router.delete("/:id", bidController.deleteBid);

export default router;
