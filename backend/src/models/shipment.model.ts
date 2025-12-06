import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/config";

export interface ShipmentAttributes {
  id: number;
  trackingId: string;
  status: string;
  eta: Date;
  tenderId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipmentCreationAttributes
  extends Optional<ShipmentAttributes, "id"> {}

export class Shipment
  extends Model<ShipmentAttributes, ShipmentCreationAttributes>
  implements ShipmentAttributes
{
  public id!: number;
  public trackingId!: string;
  public status!: string;
  public eta!: Date;
  public tenderId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shipment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    trackingId: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    eta: { type: DataTypes.DATE, allowNull: false },
    tenderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: "shipments",
  }
);
