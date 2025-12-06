import { Request, Response } from "express";
import PaymentService from "../services/payment.service";

class PaymentController {
  async deposit(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const { payerAddress, beneficiaryAddress, amount } = req.body;
      const tenderIdNumber = parseInt(tenderId, 10);

      const result = await PaymentService.depositFunds(
        tenderIdNumber,
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
      const tenderIdNumber = parseInt(tenderId, 10);

      const result = await PaymentService.releasePayment(tenderIdNumber, shipmentId);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async refund(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const { callerAddress } = req.body;
      const tenderIdNumber = parseInt(tenderId, 10);

      const result = await PaymentService.refund(tenderIdNumber, callerAddress);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getEscrow(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const tenderIdNumber = parseInt(tenderId, 10);
      const result = await PaymentService.getEscrow(tenderIdNumber);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getByTender(req: Request, res: Response) {
    try {
      const { tenderId } = req.params;
      const tenderIdNumber = parseInt(tenderId, 10);
      const payments = await PaymentService.getPaymentsByTender(tenderIdNumber);
      res.json(payments);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paymentId = parseInt(id, 10);
      const payment = await PaymentService.getPaymentById(paymentId);
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
