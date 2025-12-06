import { Request, Response } from "express";
import SupplierService from "../services/supplier.service";

class SupplierController {
  async getAll(req: Request, res: Response) {
    try {
      const suppliers = await SupplierService.getAll();
      res.json(suppliers);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const supplier = await SupplierService.getOne(parseInt(req.params.id));
      res.json(supplier);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, contactEmail } = req.body;
      const supplier = await SupplierService.createSupplier(name, contactEmail);
      res.json(supplier);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getBids(req: Request, res: Response) {
    try {
      const bids = await SupplierService.getSupplierBids(req.params.id);
      res.json(bids);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getWonTenders(req: Request, res: Response) {
    try {
      const tenders = await SupplierService.getSupplierWonTenders(parseInt(req.params.id));
      res.json(tenders);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export const supplierController = new SupplierController();
