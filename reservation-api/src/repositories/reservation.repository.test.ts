import reservationRepository from "./reservation.repository";
import Reservation from "../models/reservation.model";

jest.mock("../models/reservation.model");

describe("ReservationRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a reservation", async () => {
      const data = { room: "A", user: "U", startDate: new Date(), endDate: new Date() };
      (Reservation.create as jest.Mock).mockResolvedValue(data);

      const result = await reservationRepository.create(data);
      expect(Reservation.create).toHaveBeenCalledWith(data);
      expect(result).toBe(data);
    });
  });

  describe("findAll", () => {
    it("should find and count reservations with default options", async () => {
      const mockResult = { rows: [], count: 0 };
      (Reservation.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await reservationRepository.findAll();
      expect(Reservation.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [["startDate", "ASC"]],
        limit: 10,
        offset: 0,
      });
      expect(result).toBe(mockResult);
    });

    it("should find and count reservations with custom options", async () => {
      const mockResult = { rows: [], count: 0 };
      (Reservation.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);

      const filters = { room: "A" };
      const options = { page: 2, limit: 5, sort: "endDate", order: "desc" as "desc" };
      const result = await reservationRepository.findAll(filters, options);

      expect(Reservation.findAndCountAll).toHaveBeenCalledWith({
        where: filters,
        order: [["endDate", "DESC"]],
        limit: 5,
        offset: 5,
      });
      expect(result).toBe(mockResult);
    });
  });

  describe("findById", () => {
    it("should find reservation by id", async () => {
      const mockReservation = { id: 1 };
      (Reservation.findByPk as jest.Mock).mockResolvedValue(mockReservation);

      const result = await reservationRepository.findById(1);
      expect(Reservation.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(mockReservation);
    });
  });

  describe("delete", () => {
    it("should delete reservation by id", async () => {
      (Reservation.destroy as jest.Mock).mockResolvedValue(1);

      const result = await reservationRepository.delete(1);
      expect(Reservation.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });
  });
});