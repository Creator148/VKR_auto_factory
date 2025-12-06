import { Request, Response } from "express";
import BidService from "../services/bid.service";

class BidController {
  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const bid = await BidService.getBidById(id);
      res.json(bid);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getByTender(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.tenderId, 10);
      const bids = await BidService.getBidsByTender(id);
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
      const id = parseInt(req.params.id, 10);
      const bid = await BidService.updateBid(id, req.body);
      res.json(bid);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteBid(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await BidService.deleteBid(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export const bidController = new BidController();
