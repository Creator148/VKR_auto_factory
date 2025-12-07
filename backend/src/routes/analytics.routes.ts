import { Router } from "express";
import { Bid, Payment, Shipment, Tender } from "../models";

const router = Router();
router.get("/basic", async (req, res) => {
  const tenders = await Tender.findAll();
  const bids = await Bid.findAll();
  const shipments = await Shipment.findAll();
  const payments = await Payment.findAll();

  res.json({
    tenderCount: tenders.length,
    awardedCount: tenders.filter(t => t.status === "awarded").length,
    shipmentDelivered: shipments.filter(s => s.status === "delivered").length,
    paymentCount: payments.length,
  });
});
