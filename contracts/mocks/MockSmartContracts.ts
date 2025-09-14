// contracts/mocks/MockSmartContracts.ts
import { EventEmitter } from "events";
import crypto from "crypto";

/**
 * Простая in-memory имитация поведения смарт-контрактов.
 * Используй этот сервис из backend (BackendAPI/services/MockSmartContractService.ts).
 *
 * Методы возвращают объект { txHash, ... } чтобы имитировать on-chain tx.
 */

type Tender = {
  id: number;
  requester: string;
  detailsCID: string;
  deadline: number;
  status: "OPEN" | "AWARDED" | "CLOSED";
  awardedBidId?: number;
  createdAt: number;
};

type Bid = {
  id: number;
  supplier: string;
  price: number;
  deliveryTime: number;
  metadataCID: string;
  status: "ACTIVE" | "ACCEPTED" | "REJECTED";
  submittedAt: number;
};

type Shipment = {
  id: number;
  contractId: number;
  shipper: string;
  nfcTag: string;
  gps?: string;
  docCID?: string;
  shippedAt: number;
  receivedAt?: number;
  received?: boolean;
};

type Escrow = {
  tenderId: number;
  payer: string;
  beneficiary: string;
  amount: number;
  released: boolean;
};

export class MockSmartContractService extends EventEmitter {
  private nextTenderId = 0;
  private tenders = new Map<number, Tender>();
  private bids = new Map<number, Bid[]>(); // tenderId -> bids
  private nextShipmentId = 0;
  private shipments = new Map<number, Shipment>();
  private escrows = new Map<number, Escrow>();

  private txHash(): string {
    return "0x" + crypto.randomBytes(16).toString("hex");
  }

  async createTender(requester: string, detailsCID: string, deadline: number) {
    const txHash = this.txHash();
    this.nextTenderId++;
    const tid = this.nextTenderId;
    const now = Date.now();
    this.tenders.set(tid, { id: tid, requester, detailsCID, deadline, status: "OPEN", createdAt: now });
    this.bids.set(tid, []);
    // emit event
    this.emit("TenderCreated", { txHash, tenderId: tid, requester, detailsCID, deadline });
    return { txHash, tenderId: tid };
  }

  async submitBid(tenderId: number, supplier: string, price: number, deliveryTime: number, metadataCID: string) {
    const txHash = this.txHash();
    const arr = this.bids.get(tenderId);
    if (!arr) throw new Error("Tender not found");
    const bidId = arr.length + 1;
    const bid: Bid = { id: bidId, supplier, price, deliveryTime, metadataCID, status: "ACTIVE", submittedAt: Date.now() };
    arr.push(bid);
    this.emit("BidSubmitted", { txHash, tenderId, bidId, supplier, price, deliveryTime, metadataCID });
    return { txHash, tenderId, bidId };
  }

  async awardBid(tenderId: number, bidId: number, caller: string) {
    const txHash = this.txHash();
    const t = this.tenders.get(tenderId);
    if (!t) throw new Error("Tender not found");
    if (t.requester !== caller) throw new Error("Only requester can award");
    const arr = this.bids.get(tenderId) || [];
    const bid = arr[bidId - 1];
    if (!bid) throw new Error("Bid not found");
    t.awardedBidId = bidId;
    t.status = "AWARDED";
    bid.status = "ACCEPTED";
    this.emit("BidAwarded", { txHash, tenderId, bidId, supplier: bid.supplier, price: bid.price });
    return { txHash, tenderId, bidId, supplier: bid.supplier };
  }

  async depositFunds(tenderId: number, payer: string, beneficiary: string, amount: number) {
    const txHash = this.txHash();
    if (this.escrows.has(tenderId)) throw new Error("Escrow already exists");
    this.escrows.set(tenderId, { tenderId, payer, beneficiary, amount, released: false });
    this.emit("FundsDeposited", { txHash, tenderId, payer, beneficiary, amount });
    return { txHash, tenderId };
  }

  async recordShipment(contractId: number, shipper: string, nfcTag: string, gps?: string, docCID?: string) {
    const txHash = this.txHash();
    this.nextShipmentId++;
    const sid = this.nextShipmentId;
    const s: Shipment = { id: sid, contractId, shipper, nfcTag, gps, docCID, shippedAt: Date.now() };
    this.shipments.set(sid, s);
    this.emit("ShipmentRecorded", { txHash, shipmentId: sid, contractId, shipper, nfcTag, gps, docCID });
    return { txHash, shipmentId: sid };
  }

  async confirmReceipt(shipmentId: number, receiver: string) {
    const txHash = this.txHash();
    const s = this.shipments.get(shipmentId);
    if (!s) throw new Error("Shipment not found");
    if (s.received) throw new Error("Already received");
    s.received = true;
    s.receivedAt = Date.now();
    this.emit("GoodsReceived", { txHash, shipmentId, contractId: s.contractId, shipper: s.shipper, receiver });
    return { txHash, shipmentId };
  }

  async releasePayment(tenderId: number) {
    const txHash = this.txHash();
    const esc = this.escrows.get(tenderId);
    if (!esc) throw new Error("Escrow not found");
    if (esc.released) throw new Error("Already released");
    esc.released = true;
    this.emit("PaymentReleased", { txHash, tenderId, beneficiary: esc.beneficiary, amount: esc.amount });
    return { txHash, tenderId, beneficiary: esc.beneficiary, amount: esc.amount };
  }

  // helpers to read state in backend
  getTender(tid: number) { return this.tenders.get(tid); }
  getBids(tid: number) { return this.bids.get(tid) || []; }
  getEscrow(tid: number) { return this.escrows.get(tid); }
}
