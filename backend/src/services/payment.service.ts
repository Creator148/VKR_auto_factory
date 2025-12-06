import mockContracts from "./mockContracts.service";

class PaymentService {
  async depositFunds(
    tenderId: string,
    payerAddress: string,
    beneficiaryAddress: string,
    amount: number
  ) {
    return mockContracts.depositFunds(tenderId, payerAddress, beneficiaryAddress, amount);
  }

  async releasePayment(tenderId: string, shipmentId?: string) {
    return mockContracts.releasePayment(tenderId, shipmentId);
  }

  async refund(tenderId: string, callerAddress: string) {
    return mockContracts.refund(tenderId, callerAddress);
  }

  async getEscrow(tenderId: string) {
    return mockContracts.getEscrow(tenderId);
  }

  async getPaymentsByTender(tenderId: string) {
    // В будущем можно через Payment.findAll()
    // пока сделаем через DB: Payment.findAll()
    const { Payment } = require("../models");
    return Payment.findAll({ where: { tenderId } });
  }

  async getPaymentById(id: string) {
    const { Payment } = require("../models");
    return Payment.findByPk(id);
  }

  async getAllPayments() {
    const { Payment } = require("../models");
    return Payment.findAll();
  }
}

export default new PaymentService();
