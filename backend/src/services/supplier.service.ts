import { Supplier, Bid, Tender } from "../models";

class SupplierService {
  async getAll() {
    return Supplier.findAll();
  }

  async getOne(id: string) {
    return Supplier.findByPk(id);
  }

  async createSupplier(name: string, contactEmail: string) {
    return Supplier.create({ name, contactEmail });
  }

  async getSupplierBids(id: string) {
    return Bid.findAll({
      where: { supplierId: id },
      include: [{ model: Tender, as: "tender" }],
    });
  }

  async getSupplierWonTenders(id: string) {
    return Tender.findAll({
      where: { winnerId: id },
    });
  }
}

export default new SupplierService();
