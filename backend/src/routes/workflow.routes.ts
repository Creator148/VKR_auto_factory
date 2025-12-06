import { Router } from "express";
import { workflowController } from "../controllers/workflow.controller";

const router = Router();

router.post("/demo", workflowController.demo);

export default router;
