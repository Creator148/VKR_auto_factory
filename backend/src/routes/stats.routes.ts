import { Router } from "express";
import { dashboardStats } from "../controllers/stats.controller";

const router = Router();
router.get("/dashboard", dashboardStats);
export default router;