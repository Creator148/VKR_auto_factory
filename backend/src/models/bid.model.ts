import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/config";

export interface BidAttributes {
  id: string;
  price: number;
  deliveryTime: string;
  comment?: string | null;
  tenderId: string;
  supplierId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BidCreationAttributes
  extends Optional<BidAttributes, "id" | "comment"> {}

export class Bid
  extends Model<BidAttributes, BidCreationAttributes>
  implements BidAttributes
{
  public id!: string;
  public price!: number;
  public deliveryTime!: string;
  public comment!: string | null;
  public tenderId!: string;
  public supplierId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Bid.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    price: { type: DataTypes.INTEGER, allowNull: false },
    deliveryTime: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    tenderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    supplierId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: "bids",
  }
);

