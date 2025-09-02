import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ReservationAttributes {
  id: number;
  room: string;
  user: string;
  startDate: Date | string;
  endDate: Date | string;
}

export interface ReservationCreationAttributes
  extends Optional<ReservationAttributes, "id"> {}

class Reservation
  extends Model<ReservationAttributes, ReservationCreationAttributes>
  implements ReservationAttributes
{
  public id!: number;
  public room!: string;
  public user!: string;
  public startDate!: Date;
  public endDate!: Date;
}

Reservation.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    room: { type: DataTypes.STRING, allowNull: false },
    user: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: "Reservation" }
);

export default Reservation;
