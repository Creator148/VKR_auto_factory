import { Bid, Supplier, Tender } from "../models";

class BidService {
  async getBidById(id: string) {
    return Bid.findByPk(id, {
      include: [{ model: Supplier, as: "supplier" }],
    });
  }

  async getBidsByTender(tenderId: string) {
    return Bid.findAll({
      where: { tenderId },
      include: [{ model: Supplier, as: "supplier" }],
    });
  }

  async getBidsBySupplier(supplierId: number) {
    return Bid.findAll({
      where: { supplierId },
      include: [{ model: Tender, as: "tender" }],
    });
  }

  async updateBid(
    id: string,
    data: { price?: number; deliveryTime?: string; comment?: string }
  ) {
    const bid = await Bid.findByPk(id);
    if (!bid) throw new Error("Bid not found");

    bid.set(data);
    await bid.save();

    return bid;
  }

  async deleteBid(id: string) {
    const bid = await Bid.findByPk(id);
    if (!bid) throw new Error("Bid not found");

    await bid.destroy();
    return { deleted: true };
  }
}

export default new BidService();
