import { EventEmitter } from "events";
import crypto from "crypto";
import { sequelize } from "../db/config";
import { Tender, Bid, Supplier, Shipment, Payment } from "../models";

type Escrow = {
  tenderId: number;
  payer: string;
  beneficiary: string;
  amount: number;
  released: boolean;
};

export class MockSmartContractService extends EventEmitter {
  blockchain: Array<{
  blockNumber: number;
  txHash: string;
  event: string;
  payload: any;
  timestamp: number;
}> = [];

private blockCounter = 1;

private emitEvent(event: string, payload: any) {
  const txHash = crypto.randomBytes(16).toString("hex");
  const blockNumber = this.blockCounter++;

  const entry = {
    blockNumber,
    txHash,
    event,
    payload,
    timestamp: Date.now()
  };

  this.blockchain.push(entry);

  console.log(`[EVENT] ${event}`, entry);

  return entry;
}

  private escrows = new Map<number, Escrow>(); // tenderId -> escrow

  private txHash(): string {
    return "0x" + crypto.randomBytes(16).toString("hex");
  }

  /**
   * Создать тендер
   */
  async createTender(
    requesterAddress: string,
    detailsCID: string,
    deadline: number,
    payload: { title?: string; description?: string; budget?: number } = {}
  ) {
    const txHash = this.txHash();
    const tx = await sequelize.transaction();
    try {
      const tender = await Tender.create(
        {
          title: payload.title ?? "Untitled tender",
          description: payload.description ?? detailsCID,
          budget: payload.budget ?? 0,
          status: "open",
        },
        { transaction: tx }
      );

      await tx.commit();

      this.emitEvent("TenderCreated", {
        txHash,
        tenderId: tender.id,
        requester: requesterAddress,
        detailsCID,
        deadline,
        createdAt: Date.now(),
      });

      return { txHash, tenderId: tender.id };
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }

  /**
   * Подать заявку (bid) на тендер.
   */
  async submitBid(
    tenderId: number,
    supplierAddress: string,
    price: number,
    deliveryTime: string,
    metadataCID?: string
  ) {
    const txHash = this.txHash();
    const tx = await sequelize.transaction();
    try {
      const tender = await Tender.findByPk(tenderId, { transaction: tx });
      if (!tender) throw new Error("Tender not found");
      if (tender.status !== "open") throw new Error("Tender not open for bids");

      let supplier = await Supplier.findOne({
        where: { name: supplierAddress },
        transaction: tx,
      });
      if (!supplier) {
        supplier = await Supplier.create(
          { name: supplierAddress, contactEmail: `${supplierAddress}@example` },
          { transaction: tx }
        );
      }

      const bid = await Bid.create(
        {
          price,
          deliveryTime,
          comment: metadataCID ?? null,
          tenderId: tender.id,
          supplierId: supplier.id,
        },
        { transaction: tx }
      );

      await tx.commit();

      this.emit("BidSubmitted", {
        txHash,
        tenderId: tender.id,
        bidId: bid.id,
        supplier: supplier.name,
        price,
        deliveryTime,
        metadataCID,
      });

      return { txHash, tenderId: tender.id, bidId: bid.id };
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }

  /**
   * Присудить заявку
   */
  async awardBid(tenderId: number, bidId: number, callerAddress: string) {
    const txHash = this.txHash();
    const tx = await sequelize.transaction();
    try {
      const tender = await Tender.findByPk(tenderId, { transaction: tx });
      if (!tender) throw new Error("Tender not found");
      if (tender.status !== "open") throw new Error("Tender not open");

      const bid = await Bid.findByPk(bidId, { transaction: tx });
      if (!bid) throw new Error("Bid not found");

      tender.winnerId = bid.supplierId;
      tender.status = "awarded";
      await tender.save({ transaction: tx });

      bid.comment = (bid.comment || "") + " | accepted";
      await bid.save({ transaction: tx });

      await tx.commit();

      const supplier = await Supplier.findByPk(bid.supplierId);

      this.emit("BidAwarded", {
        txHash,
        tenderId,
        bidId,
        supplier: supplier?.name ?? null,
        price: bid.price,
      });

      return { txHash, tenderId, bidId, supplier: supplier?.name ?? null };
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }

  /**
   * Депонирование средств в эскроу (in-memory)
   */
  async depositFunds(tenderId: number, payerAddress: string, beneficiaryAddress: string, amount: number) {
    const txHash = this.txHash();

    if (this.escrows.has(tenderId)) {
      throw new Error("Escrow already exists for tender");
    }

    const escrow: Escrow = {
      tenderId,
      payer: payerAddress,
      beneficiary: beneficiaryAddress,
      amount,
      released: false,
    };

    this.escrows.set(tenderId, escrow);

    this.emit("FundsDeposited", { txHash, tenderId, payer: payerAddress, beneficiary: beneficiaryAddress, amount });

    return { txHash, tenderId };
  }

  /**
   * Выпустить платеж — создаёт Payment в БД и помечает эскроу как released.
   */
  async releasePayment(tenderId: number, shipmentId?: number) {
    const txHash = this.txHash();

    const escrow = this.escrows.get(tenderId);
    if (!escrow) throw new Error("No escrow found");
    if (escrow.released) throw new Error("Escrow already released");

    const tx = await sequelize.transaction();
    try {
      const payment = await Payment.create(
        {
          amount: escrow.amount,
          status: "completed",
          shipmentId: shipmentId ?? null,
        },
        { transaction: tx }
      );

      escrow.released = true;
      this.escrows.set(tenderId, escrow);

      await tx.commit();

      this.emit("PaymentReleased", {
        txHash,
        tenderId,
        beneficiary: escrow.beneficiary,
        amount: escrow.amount,
        paymentId: payment.id,
      });

      return { txHash, tenderId, paymentId: payment.id };
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }

  async refund(tenderId: number, callerAddress: string) {
    const txHash = this.txHash();

    const escrow = this.escrows.get(tenderId);
    if (!escrow) throw new Error("No escrow");
    if (escrow.payer !== callerAddress) throw new Error("Only payer can request refund");
    if (escrow.released) throw new Error("Already released");

    this.escrows.delete(tenderId);

    this.emit("RefundIssued", { txHash, tenderId, payer: callerAddress, amount: escrow.amount });

    return { txHash, tenderId };
  }

  /**
   * Record shipment
   */
  async recordShipment(tenderId: number, shipperAddress: string, trackingId: string, eta: string, docCID?: string) {
    const txHash = this.txHash();
    const tx = await sequelize.transaction();
    try {
      const tender = await Tender.findByPk(tenderId, { transaction: tx });
      if (!tender) throw new Error("Tender not found");
      if (tender.status !== "awarded") throw new Error("Tender must be awarded to record shipment");

      const shipment = await Shipment.create(
        {
          trackingId,
          status: "created",
          eta: new Date(eta),
          tenderId,
        },
        { transaction: tx }
      );

      await tx.commit();

      this.emit("ShipmentRecorded", {
        txHash,
        shipmentId: shipment.id,
        contractId: tenderId,
        shipper: shipperAddress,
        trackingId,
        eta,
        docCID,
      });

      return { txHash, shipmentId: shipment.id };
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }

  /**
   * Confirm receipt
   */
  async confirmReceipt(shipmentId: number, receiverAddress: string) {
    const txHash = this.txHash();
    const tx = await sequelize.transaction();
    try {
      const shipment = await Shipment.findByPk(shipmentId, { transaction: tx });
      if (!shipment) throw new Error("Shipment not found");
      if (shipment.status === "delivered") throw new Error("Already delivered");

      shipment.status = "delivered";
      await shipment.save({ transaction: tx });

      const tenderId = shipment.tenderId;

      await tx.commit();

      this.emit("GoodsReceived", {
        txHash,
        shipmentId,
        contractId: tenderId,
        shipper: shipment.trackingId,
        receiver: receiverAddress,
      });

      if (this.escrows.has(tenderId)) {
        // await to ensure payment is created before returning if you need sync behaviour
        await this.releasePayment(tenderId, shipmentId);
      }

      return { txHash, shipmentId };
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }

  getEscrow(tenderId: number) {
    return this.escrows.get(tenderId);
  }

  async getTender(tenderId: string) {
    return Tender.findByPk(tenderId, {
      include: [{ model: Bid, as: "bids" }, { model: Supplier, as: "winner" }],
    });
  }

  async getBids(tenderId: number) {
    return Bid.findAll({ where: { tenderId }, include: [{ model: Supplier, as: "supplier" }] });
  }
}

const mockContracts = new MockSmartContractService();
export default mockContracts;
