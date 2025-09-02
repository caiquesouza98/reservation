import ReservationController from './reservation.controller';
import reservationService from '../services/reservation.service';
import { matchedData } from 'express-validator';

jest.mock('../services/reservation.service');
jest.mock('express-validator', () => ({
  matchedData: jest.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('ReservationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a reservation and respond with 201', async () => {
      const req: any = {};
      const res = mockRes();
      const reservation = { id: 1, room: 'A', user: 'U', startDate: new Date(), endDate: new Date() };
      (matchedData as jest.Mock).mockReturnValue({ room: 'A', user: 'U', startDate: new Date(), endDate: new Date() });
      (reservationService.createReservation as jest.Mock).mockResolvedValue(reservation);

      await ReservationController.create(req, res, mockNext);

      expect(matchedData).toHaveBeenCalledWith(req, { locations: ['body'] });
      expect(reservationService.createReservation).toHaveBeenCalledWith(expect.objectContaining({ room: 'A', user: 'U' }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(reservation);
    });

    it('should call next on error', async () => {
      const req: any = {};
      const res = mockRes();
      const error = new Error('fail');
      (matchedData as jest.Mock).mockReturnValue({});
      (reservationService.createReservation as jest.Mock).mockRejectedValue(error);

      await ReservationController.create(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createRecurring', () => {
    it('should create recurring reservations and respond with 201', async () => {
      const req: any = {};
      const res = mockRes();
      const reservations = [{ id: 1 }, { id: 2 }];
      (matchedData as jest.Mock).mockReturnValue({ room: 'A', user: 'U', startDate: new Date(), endDate: new Date(), frequency: 'daily', occurrences: 2 });
      (reservationService.createRecurringReservations as jest.Mock).mockResolvedValue(reservations);

      await ReservationController.createRecurring(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(reservations);
    });

    it('should call next on error', async () => {
      const req: any = {};
      const res = mockRes();
      const error = new Error('fail');
      (matchedData as jest.Mock).mockReturnValue({});
      (reservationService.createRecurringReservations as jest.Mock).mockRejectedValue(error);

      await ReservationController.createRecurring(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('list', () => {
    it('should list reservations and respond with paginated result', async () => {
      const req: any = {};
      const res = mockRes();
      const result = { count: 2, rows: [{ id: 1 }, { id: 2 }] };
      (matchedData as jest.Mock).mockReturnValue({ room: 'A', user: 'U', page: 1, limit: 10, sort: 'startDate', order: 'asc' });
      (reservationService.listReservations as jest.Mock).mockResolvedValue(result);

      await ReservationController.list(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        total: 2,
        page: 1,
        limit: 10,
        data: result.rows,
      });
    });

    it('should call next on error', async () => {
      const req: any = {};
      const res = mockRes();
      const error = new Error('fail');
      (matchedData as jest.Mock).mockReturnValue({});
      (reservationService.listReservations as jest.Mock).mockRejectedValue(error);

      await ReservationController.list(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update reservation and respond with updated reservation', async () => {
      const req: any = {};
      const res = mockRes();
      const updated = { id: 1, startDate: new Date(), endDate: new Date() };
      (matchedData as jest.Mock).mockReturnValue({ id: 1, startDate: new Date(), endDate: new Date() });
      (reservationService.updateReservation as jest.Mock).mockResolvedValue(updated);

      await ReservationController.update(req, res, mockNext);

      expect(reservationService.updateReservation).toHaveBeenCalledWith(1, expect.objectContaining({ startDate: expect.any(Date) }));
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should call next on error', async () => {
      const req: any = {};
      const res = mockRes();
      const error = new Error('fail');
      (matchedData as jest.Mock).mockReturnValue({ id: 1 });
      (reservationService.updateReservation as jest.Mock).mockRejectedValue(error);

      await ReservationController.update(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('cancel', () => {
    it('should cancel reservation and respond with success message', async () => {
      const req: any = {};
      const res = mockRes();
      (matchedData as jest.Mock).mockReturnValue({ id: 1 });
      (reservationService.cancelReservation as jest.Mock).mockResolvedValue(undefined);

      await ReservationController.cancel(req, res, mockNext);

      expect(reservationService.cancelReservation).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ message: "Reserva cancelada com sucesso." });
    });

    it('should call next on error', async () => {
      const req: any = {};
      const res = mockRes();
      const error = new Error('fail');
      (matchedData as jest.Mock).mockReturnValue({ id: 1 });
      (reservationService.cancelReservation as jest.Mock).mockRejectedValue(error);

      await ReservationController.cancel(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});