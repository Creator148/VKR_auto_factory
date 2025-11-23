import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config";

export class Supplier extends Model {}

Supplier.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false },
    contactEmail: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "suppliers",
  }
);
