import { Request, Response } from "express";
import PaymentService from "../services/payment.service";

class PaymentController {
  async deposit(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const { payerAddress, beneficiaryAddress, amount } = req.body;

      const result = await PaymentService.depositFunds(
        tenderId,
        payerAddress,
        beneficiaryAddress,
        amount
      );

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async release(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const { shipmentId } = req.body;

      const result = await PaymentService.releasePayment(tenderId, shipmentId);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async refund(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const { callerAddress } = req.body;

      const result = await PaymentService.refund(tenderId, callerAddress);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getEscrow(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;

      const result = await PaymentService.getEscrow(tenderId);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getByTender(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const payments = await PaymentService.getPaymentsByTender(tenderId);
      res.json(payments);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(id);
      res.json(payment);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const payments = await PaymentService.getAllPayments();
      res.json(payments);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export const paymentController = new PaymentController();
