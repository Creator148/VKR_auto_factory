import { Tender, Shipment, Payment, Bid } from "../models";
import { Op } from "sequelize";

export const getDashboardStats = async () => {
  const totalTenders = await Tender.count();
  const completedTenders = await Tender.count({ where: { status: "completed" } });
  const tendersWithWinner = await Tender.count({ where: { winnerId: { [Op.not]: null } } });

  const totalBids = await Bid.count();

  const totalShipments = await Shipment.count();
  const deliveredShipments = await Shipment.count({ where: { status: "delivered" } });

  const totalPayments = await Payment.count();
  const paidPayments = await Payment.count({ where: { status: "paid" } });

  const paymentSum = await Payment.sum("amount") || 0;
  const avgPayment = totalPayments ? paymentSum / totalPayments : 0;

  const avgBidsPerTender = totalTenders ? totalBids / totalTenders : 0;

  return {
    tenders: {
      total: totalTenders,
      completed: completedTenders,
      completionRate: totalTenders ? (completedTenders / totalTenders) * 100 : 0,
      withWinnerRate: totalTenders ? (tendersWithWinner / totalTenders) * 100 : 0,
      avgBidsPerTender
    },
    shipments: {
      total: totalShipments,
      delivered: deliveredShipments,
      deliveryRate: totalShipments ? (deliveredShipments / totalShipments) * 100 : 0
    },
    payments: {
      total: totalPayments,
      paid: paidPayments,
      successRate: totalPayments ? (paidPayments / totalPayments) * 100 : 0,
      totalVolume: paymentSum,
      avgPayment
    }
  };
};