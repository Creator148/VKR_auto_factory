import mockContracts from "./mockContracts.service";

class PaymentService {
  async depositFunds(
    tenderId: number,
    payerAddress: string,
    beneficiaryAddress: string,
    amount: number
  ) {
    return mockContracts.depositFunds(tenderId, payerAddress, beneficiaryAddress, amount);
  }

  async releasePayment(tenderId: number, shipmentId?: number) {
    return mockContracts.releasePayment(tenderId, shipmentId);
  }

  async refund(tenderId: number, callerAddress: string) {
    return mockContracts.refund(tenderId, callerAddress);
  }

  async getEscrow(tenderId: number) {
    return mockContracts.getEscrow(tenderId);
  }

  async getPaymentsByTender(tenderId: number) {
    // В будущем можно через Payment.findAll()
    // пока сделаем через DB: Payment.findAll()
    const { Payment } = require("../models");
    return Payment.findAll({ where: { tenderId } });
  }

  async getPaymentById(id: number) {
    const { Payment } = require("../models");
    return Payment.findByPk(id);
  }

  async getAllPayments() {
    const { Payment } = require("../models");
    return Payment.findAll();
  }
}

export default new PaymentService();
