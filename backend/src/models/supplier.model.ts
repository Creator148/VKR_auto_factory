import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db/config";

interface SupplierAttributes {
  id: number;
  name: string;
  contactEmail: string;
}

interface SupplierCreationAttributes extends Optional<SupplierAttributes, "id"> {}

export class Supplier
  extends Model<SupplierAttributes, SupplierCreationAttributes>
  implements SupplierAttributes
{
  public id!: number;
  public name!: string;
  public contactEmail!: string;
}

Supplier.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "suppliers",
  }
);
