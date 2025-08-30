import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize: Sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: (process.env.DB_DIALECT as any) || "mysql",
    logging: false,
  }
);

export default sequelize;
