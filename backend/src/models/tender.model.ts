import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/config";

interface TenderAttributes {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  winnerId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TenderCreationAttributes extends Optional<TenderAttributes, "id" | "winnerId"> {}

export class Tender
  extends Model<TenderAttributes, TenderCreationAttributes>
  implements TenderAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public budget!: number;
  public status!: string;
  public winnerId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tender.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    budget: DataTypes.INTEGER,
    status: DataTypes.STRING,
    winnerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "tenders",
  }
);
