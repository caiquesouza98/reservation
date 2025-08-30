import Reservation, {
  ReservationAttributes,
  ReservationCreationAttributes,
} from "../models/reservation.model";

class ReservationRepository {
  async create(data: ReservationCreationAttributes): Promise<Reservation> {
    return await Reservation.create(data);
  }

  async findAll(filters: Partial<ReservationAttributes> = {}): Promise<Reservation[]> {
    return await Reservation.findAll({ where: filters });
  }

  async findById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id);
  }

  async delete(id: number): Promise<number> {
    return await Reservation.destroy({ where: { id } });
  }
}

export default new ReservationRepository();
