import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config";

export class Shipment extends Model {}

Shipment.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    trackingId: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("created", "in_transit", "arrived", "delivered"),
      defaultValue: "created",
    },
    eta: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: "shipments",
  }
);
