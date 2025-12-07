import mockContracts from "./Contracts.service";
import { Shipment } from "../models";
import { Op } from "sequelize";
import { isNull } from "util";

export interface CreateShipmentDTO {
  tenderId: number;
  shipperAddress: string;
  trackingId: string;
  eta: string;             
  docCID?: string;  
}

export class ShipmentService {
  async createShipment(dto: CreateShipmentDTO) {
    if (!dto.trackingId) throw new Error("Tracking ID is required");
    if (isNull(dto.tenderId)) throw new Error("Invalid tenderId");

    const result = await mockContracts.recordShipment(
      dto.tenderId,
      dto.shipperAddress,
      dto.trackingId,
      dto.eta,
      dto.docCID
    );

    return result; // { txHash, shipmentId }
  }

  async confirmReceipt(shipmentId: number, receiverAddress: string) {
    if (isNaN(shipmentId)) throw new Error("Invalid shipmentId");

    const result = await mockContracts.confirmReceipt(
      shipmentId,
      receiverAddress
    );

    return result; // { txHash, shipmentId }
  }
  async getShipmentById(shipmentId: number) {
    const shipment = await Shipment.findByPk(shipmentId);
    if (!shipment) throw new Error("Shipment not found");
    return shipment;
  }
  async getShipmentsByTenderId(tenderId: number) {
    if (isNull(tenderId)) throw new Error("Invalid tenderId");

    return Shipment.findAll({
      where: { tenderId },
      order: [["createdAt", "DESC"]],
    });
  }
  async getShipmentsByStatus(status: string) {
    return Shipment.findAll({
      where: { status: { [Op.eq]: status } },
      order: [["createdAt", "DESC"]],
    });
  }
  async getAllShipments() {
    return Shipment.findAll({
      order: [["createdAt", "DESC"]],
    });
  }
}

export default new ShipmentService();
