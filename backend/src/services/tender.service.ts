import mockContracts from "./mockContracts.service";

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
    // Можно сделать DB-level query, но MVP — через mockContracts
    return []; // TODO: можно вернуть Tender.findAll()
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

  async awardBid(tenderId: string, bidId: string, callerAddress: string) {
    return mockContracts.awardBid(tenderId, bidId, callerAddress);
  }

  async getBids(tenderId: string) {
    return mockContracts.getBids(tenderId);
  }
}

export default new TenderService();
