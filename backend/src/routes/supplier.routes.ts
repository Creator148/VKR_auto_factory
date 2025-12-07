import { Router } from "express";
import { supplierController } from "../controllers/supplier.controller";

const router = Router();

router.get("/", supplierController.getAll);
router.get("/:id", supplierController.getOne);
router.post("/", supplierController.create);
router.get("/:id/bids", supplierController.getBids);
router.get("/:id/won", supplierController.getWonTenders);
router.get("/:id/profile", supplierController.getProfile);

export default router;
