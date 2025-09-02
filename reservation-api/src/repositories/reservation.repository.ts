import { FindOptions } from "sequelize";
import Reservation, {
  ReservationAttributes,
  ReservationCreationAttributes,
} from "../models/reservation.model";

class ReservationRepository {
  async create(data: ReservationCreationAttributes): Promise<Reservation> {
    return await Reservation.create(data);
  }

  async findAll(
    filters: Partial<ReservationAttributes> = {},
    options: { page?: number; limit?: number; sort?: string; order?: "asc" | "desc" } = {}
  ): Promise<{ rows: Reservation[]; count: number }> {
    const { page = 1, limit = 10, sort = "startDate", order = "asc" } = options;

    const query: FindOptions = {
      where: filters,
      order: [[sort, order.toUpperCase()]],
      limit,
      offset: (page - 1) * limit,
    };

    return await Reservation.findAndCountAll(query);
  }

  async findById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id);
  }

  async delete(id: number): Promise<number> {
    return await Reservation.destroy({ where: { id } });
  }
}

export default new ReservationRepository();
