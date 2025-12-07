import { Request, Response } from "express";
import SupplierService from "../services/supplier.service";
import { Bid, Shipment, Supplier } from "../models";

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
  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByPk(id);
      if (!supplier) return res.status(404).json({ error: "Supplier not found" });

      const bids = await Bid.findAll({ where: { supplierId: id } });

      const shipments = await Shipment.findAll();

      res.json({
        supplier,
        bids,
        shipments
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
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
