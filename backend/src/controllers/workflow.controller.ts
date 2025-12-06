import { Request, Response } from "express";
import TenderService from "../services/tender.service";
import PaymentService from "../services/payment.service";
import ShipmentService from "../services/shipment.service";

class WorkflowController {
  async demo(req: Request, res: Response) {
    try {
      // Step 1: Create Tender
      const tender = await TenderService.createTender(
        "0xCUSTOMER",
        "cid:tender-details",
        Date.now() + 86400,
        {
          title: "Demo Tender",
          description: "Test tender for supply chain demo",
          budget: 1000,
        }
      );

      const tenderId = tender.tenderId;

      // Step 2: Submit bids
      const bid1 = await TenderService.submitBid(
        tenderId,
        "supplierA",
        900,
        "5 days",
        "cid:bid1"
      );

      const bid2 = await TenderService.submitBid(
        tenderId,
        "supplierB",
        850,
        "7 days",
        "cid:bid2"
      );

      // Step 3: Award bid #2 (cheapest)
      const award = await TenderService.awardBid(
        tenderId,
        bid2.bidId,
        "0xCUSTOMER"
      );

      // Step 4: Deposit funds into escrow
      const escrow = await PaymentService.depositFunds(
        tenderId,
        "0xCUSTOMER",
        "supplierB",
        850
      );

      // Step 5: Record shipment
      const shipment = await ShipmentService.createShipment({
        tenderId,
        shipperAddress: "logisticsCo",
        trackingId: "TRACK12345",
        eta: new Date(Date.now() + 3 * 86400 * 1000).toISOString(),
        docCID: "cid:shipment-doc",
      });

      // Step 6: Confirm receipt of goods
      const receipt = await ShipmentService.confirmReceipt(
        shipment.shipmentId,
        "0xCUSTOMER"
      );

      // Step 7: Release payment (automatic because of confirmReceipt)
      const payment = await PaymentService.getPaymentsByTender(tenderId);

      return res.json({
        status: "Workflow completed",
        tender,
        bids: [bid1, bid2],
        award,
        escrow,
        shipment,
        receipt,
        payment,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const workflowController = new WorkflowController();
