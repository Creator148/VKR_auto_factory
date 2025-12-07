import { Router } from "express";
import mockContracts from "../services/Contracts.service";

const router = Router();

router.get("/events", (req, res) => {
  res.json(mockContracts.blockchain);
});

export default router;