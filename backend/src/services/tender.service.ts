import { Tender } from "../models";
import mockContracts from "./contracts.service";

class TenderService {
  async createTender(
    requesterAddress: string,
    detailsCID: string,
    deadline: number,
    payload: { title?: string; description?: string; budget?: number }
  ) {
    return mockContracts.createTender(requesterAddress, detailsCID, deadline, payload);
  }

  async getTender(id: string) {
    return mockContracts.getTender(id);
  }

  async getAllTenders() {
    return Tender.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async submitBid(
    tenderId: number,
    supplierAddress: string,
    price: number,
    deliveryTime: string,
    metadataCID?: string
  ) {
    return mockContracts.submitBid(tenderId, supplierAddress, price, deliveryTime, metadataCID);
  }

  async awardBid(tenderId: number, bidId: number, callerAddress: string) {
    const result = await mockContracts.awardBid(tenderId, bidId, callerAddress);

    // Automatically create escrow after awarding
    mockContracts.startEscrows[tenderId] = {
      balance: 0,
      locked: false,
      payer: callerAddress,
      payee: result.supplier,
      history: []
    };

    return result;
  }

  async getBids(tenderId: number) {
    return mockContracts.getBids(tenderId);
  }
}

export default new TenderService();
