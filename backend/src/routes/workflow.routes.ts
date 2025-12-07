import { Router } from "express";
import { workflowController } from "../controllers/workflow.controller";
import mockContracts from "../services/contracts.service";

const router = Router();

router.post("/demo", workflowController.demo);
router.get("/blocks", (req, res) => {
  res.json(mockContracts.blockchain);
});

export default router;
