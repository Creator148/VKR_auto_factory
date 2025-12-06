import { Request, Response } from "express";
import TenderService from "../services/tender.service";

class TenderController {
  async createTender(req: Request, res: Response) {
    try {
      const { requesterAddress, detailsCID, deadline, title, description, budget } = req.body;

      const result = await TenderService.createTender(requesterAddress, detailsCID, deadline, {
        title,
        description,
        budget,
      });

      return res.json(result);
    } catch (err: any) {
      console.error("createTender error:", err);
      return res.status(400).json({ error: err.message });
    }
  }

  async getTender(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tender = await TenderService.getTender(id);
      if (!tender) return res.status(404).json({ error: "Tender not found" });

      return res.json(tender);
    } catch (err: any) {
      console.error("getTender error:", err);
      return res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const tenders = await TenderService.getAllTenders();
      return res.json(tenders);
    } catch (err: any) {
      console.error("getAll error:", err);
      return res.status(400).json({ error: err.message });
    }
  }

  async submitBid(req: Request, res: Response) {
    try {
      const { id } = req.params; // tenderId
      const { supplierAddress, price, deliveryTime, metadataCID } = req.body;

      const result = await TenderService.submitBid(parseInt(id), supplierAddress, price, deliveryTime, metadataCID);
      return res.json(result);
    } catch (err: any) {
      console.error("submitBid error:", err);
      return res.status(400).json({ error: err.message });
    }
  }

  async awardBid(req: Request, res: Response) {
    try {
      const { id } = req.params; // tenderId
      const { bidId, callerAddress } = req.body;

      const result = await TenderService.awardBid(parseInt(id), bidId, callerAddress);
      return res.json(result);
    } catch (err: any) {
      console.error("awardBid error:", err);
      return res.status(400).json({ error: err.message });
    }
  }

  async getBids(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bids = await TenderService.getBids(parseInt(id));
      return res.json(bids);
    } catch (err: any) {
      console.error("getBids error:", err);
      return res.status(400).json({ error: err.message });
    }
  }
}

export default new TenderController();
