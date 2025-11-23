// src/services/tender.service.ts
import mockContracts from "./mockContracts.service";
import { Tender, Bid } from "../models";

interface CreateTenderPayload {
  title: string;
  description: string;
  budget: number;
  deadline: number;
  detailsCID: string;
}


export class TenderService {
  async createTender(userAddress: string, payload: CreateTenderPayload) {
    // вызываем мок — он создаст запись в БД и вернёт txHash & tenderId
    const result = await mockContracts.createTender(userAddress, payload.detailsCID, payload.deadline, {
      title: payload.title,
      description: payload.description,
      budget: payload.budget,
    });

    // result: { txHash, tenderId }
    return result;
  }

  async submitBid(tenderId: number, supplierAddress: string, price: number, deliveryTime: string, metadataCID?: string) {
    const result = await mockContracts.submitBid(tenderId, supplierAddress, price, deliveryTime, metadataCID);
    return result;
  }

  async awardBid(tenderId: number, bidId: number, callerAddress: string) {
    const result = await mockContracts.awardBid(tenderId, bidId, callerAddress);
    return result;
  }
}
