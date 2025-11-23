// src/controllers/shipment.controller.ts
import { Request, Response } from "express";
import { shipmentService } from "../services/shipment.service";

class ShipmentController {
  /**
   * POST /shipments
   */
  async createShipment(req: Request, res: Response) {
    try {
      const { tenderId, shipperAddress, trackingId, eta, docCID } = req.body;

      const result = await shipmentService.createShipment({
        tenderId: Number(tenderId),
        shipperAddress,
        trackingId,
        eta,
        docCID,
      });

      return res.status(201).json({
        message: "Shipment created",
        ...result,
      });
    } catch (error: any) {
      console.error("createShipment error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /shipments/:id/confirm
   */
  async confirmReceipt(req: Request, res: Response) {
    try {
      const shipmentId = Number(req.params.id);
      const { receiverAddress } = req.body;

      const result = await shipmentService.confirmReceipt(
        shipmentId,
        receiverAddress
      );

      return res.status(200).json({
        message: "Shipment confirmed",
        ...result,
      });
    } catch (error: any) {
      console.error("confirmReceipt error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /shipments/:id
   */
  async getShipmentById(req: Request, res: Response) {
    try {
      const shipmentId = Number(req.params.id);
      const shipment = await shipmentService.getShipmentById(shipmentId);
      return res.json(shipment);
    } catch (error: any) {
      console.error("getShipmentById error:", error);
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * GET /shipments/tender/:tenderId
   */
  async getShipmentsByTender(req: Request, res: Response) {
    try {
      const tenderId = Number(req.params.tenderId);
      const shipments = await shipmentService.getShipmentsByTenderId(tenderId);
      return res.json(shipments);
    } catch (error: any) {
      console.error("getShipmentsByTender error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /shipments/status/:status
   */
  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const shipments = await shipmentService.getShipmentsByStatus(status);
      return res.json(shipments);
    } catch (error: any) {
      console.error("getByStatus error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /shipments
   */
  async getAll(req: Request, res: Response) {
    try {
      const shipments = await shipmentService.getAllShipments();
      return res.json(shipments);
    } catch (error: any) {
      console.error("getAll shipments error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const shipmentController = new ShipmentController();
