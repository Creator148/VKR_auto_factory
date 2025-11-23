import { Router } from "express";
import TenderController from "../controllers/tender.controller";

const router = Router();

// CREATE TENDER
router.post("/", TenderController.createTender);

// GET ONE
router.get("/:id", TenderController.getTender);

// GET ALL
router.get("/", TenderController.getAll);

// SUBMIT BID
router.post("/:id/bids", TenderController.submitBid);

// AWARD BID
router.post("/:id/award", TenderController.awardBid);

// GET BIDS
router.get("/:id/bids", TenderController.getBids);

export default router;
