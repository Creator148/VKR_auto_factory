import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config";

export class Bid extends Model {}

Bid.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    price: { type: DataTypes.FLOAT, allowNull: false },
    deliveryTime: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "bids",
  }
);
