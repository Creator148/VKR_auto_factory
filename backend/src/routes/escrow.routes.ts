import { Router } from "express";
import mockContracts from "../services/contracts.service";

const router = Router();

router.get("/:id", (req, res) => {
  res.json(mockContracts.startEscrows[parseInt(req.params.id)] || null);
});

router.post("/:id/deposit", (req, res) => {
  const { from, amount } = req.body;
  res.json(mockContracts.depositFundsStart(parseInt(req.params.id), from, amount));
});

router.post("/:id/lock", (req, res) => {
  const { payee } = req.body;
  res.json(mockContracts.lockEscrow(parseInt(req.params.id), payee));
});

router.post("/:id/release", (req, res) => {
  res.json(mockContracts.releaseFunds(parseInt(req.params.id)));
});

export default router;
