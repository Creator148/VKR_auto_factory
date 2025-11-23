import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config";

export class Tender extends Model {}

Tender.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    budget: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM("open", "closed", "awarded", "completed"),
      defaultValue: "open",
    },
  },
  {
    sequelize,
    tableName: "tenders",
  }
);
