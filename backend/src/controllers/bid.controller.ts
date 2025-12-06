import { Request, Response } from "express";
import BidService from "../services/bid.service";

class BidController {
  async getOne(req: Request, res: Response) {
    try {
      const bid = await BidService.getBidById(req.params.id);
      res.json(bid);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getByTender(req: Request, res: Response) {
    try {
      const bids = await BidService.getBidsByTender(req.params.tenderId);
      res.json(bids);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getBySupplier(req: Request, res: Response) {
    try {
      const bids = await BidService.getBidsBySupplier(Number(req.params.supplierId));
      res.json(bids);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateBid(req: Request, res: Response) {
    try {
      const bid = await BidService.updateBid(req.params.id, req.body);
      res.json(bid);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteBid(req: Request, res: Response) {
    try {
      const result = await BidService.deleteBid(req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export const bidController = new BidController();
