import { Request, Response } from "express";
import { getDashboardStats } from "../services/stats.service";

export const dashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: "Dashboard stats failed" });
  }
};