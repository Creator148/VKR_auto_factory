import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/config";

export class Payment extends Model {}

Payment.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "payments",
  }
);
