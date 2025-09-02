import ReservationService from './reservation.service';
import reservationRepository from '../repositories/reservation.repository';
import redisClient from '../config/redis';
import { AppError } from '../errors/AppError';

jest.mock('../repositories/reservation.repository');
jest.mock('../config/redis', () => ({
  flushAll: jest.fn(),
}));

const mockReservation = {
  id: 1,
  room: 'A',
  user: 'U',
  startDate: new Date('2024-06-01T10:00:00Z'),
  endDate: new Date('2024-06-01T11:00:00Z'),
  update: jest.fn(),
};

describe('ReservationService - hasConflict logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReservation', () => {
    it('should create reservation when no conflict', async () => {
      (reservationRepository.findAll as jest.Mock).mockResolvedValue({ rows: [] });
      (reservationRepository.create as jest.Mock).mockResolvedValue(mockReservation);

      const data = {
        room: 'A',
        user: 'U',
        startDate: new Date('2024-06-01T12:00:00Z'),
        endDate: new Date('2024-06-01T13:00:00Z'),
      };

      const result = await ReservationService.createReservation(data);

      expect(reservationRepository.create).toHaveBeenCalledWith(data);
      expect(redisClient.flushAll).toHaveBeenCalled();
      expect(result).toEqual(mockReservation);
    });

    it('should throw AppError when conflict exists', async () => {
      const conflictReservation = {
        id: 2,
        room: 'A',
        user: 'X',
        startDate: new Date('2024-06-01T11:30:00Z'),
        endDate: new Date('2024-06-01T12:30:00Z'),
      };
      (reservationRepository.findAll as jest.Mock).mockResolvedValue({ rows: [conflictReservation] });

      const data = {
        room: 'A',
        user: 'U',
        startDate: new Date('2024-06-01T12:00:00Z'),
        endDate: new Date('2024-06-01T13:00:00Z'),
      };

      await expect(ReservationService.createReservation(data)).rejects.toThrow(AppError);
      await expect(ReservationService.createReservation(data)).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('updateReservation', () => {
    it('should update reservation when no conflict', async () => {
      (reservationRepository.findById as jest.Mock).mockResolvedValue({ ...mockReservation, update: jest.fn().mockResolvedValue('updated') });
      (reservationRepository.findAll as jest.Mock).mockResolvedValue({ rows: [mockReservation] });

      const result = await ReservationService.updateReservation(1, {
        startDate: new Date('2024-06-01T12:00:00Z'),
        endDate: new Date('2024-06-01T13:00:00Z'),
      });

      expect(redisClient.flushAll).toHaveBeenCalled();
      expect(result).toBe('updated');
    });

    it('should throw AppError when conflict exists', async () => {
      const existing = { ...mockReservation, update: jest.fn() };
      const conflictReservation = {
        id: 2,
        room: 'A',
        user: 'X',
        startDate: new Date('2024-06-01T12:30:00Z'),
        endDate: new Date('2024-06-01T13:30:00Z'),
      };
      (reservationRepository.findById as jest.Mock).mockResolvedValue(existing);
      (reservationRepository.findAll as jest.Mock).mockResolvedValue({ rows: [existing, conflictReservation] });

      await expect(
        ReservationService.updateReservation(1, {
          startDate: new Date('2024-06-01T13:00:00Z'),
          endDate: new Date('2024-06-01T14:00:00Z'),
        })
      ).rejects.toThrow(AppError);
      await expect(
        ReservationService.updateReservation(1, {
          startDate: new Date('2024-06-01T13:00:00Z'),
          endDate: new Date('2024-06-01T14:00:00Z'),
        })
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('should throw AppError if endDate <= startDate', async () => {
      (reservationRepository.findById as jest.Mock).mockResolvedValue(mockReservation);

      await expect(
        ReservationService.updateReservation(1, {
          startDate: new Date('2024-06-01T13:00:00Z'),
          endDate: new Date('2024-06-01T12:00:00Z'),
        })
      ).rejects.toThrow(AppError);
      await expect(
        ReservationService.updateReservation(1, {
          startDate: new Date('2024-06-01T13:00:00Z'),
          endDate: new Date('2024-06-01T12:00:00Z'),
        })
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('createRecurringReservations', () => {
    it('should create all reservations when no conflict', async () => {
      (reservationRepository.findAll as jest.Mock).mockResolvedValue({ rows: [] });
      (reservationRepository.create as jest.Mock).mockResolvedValue(mockReservation);

      const data = {
        room: 'A',
        user: 'U',
        startDate: new Date('2024-06-01T10:00:00Z'),
        endDate: new Date('2024-06-01T11:00:00Z'),
        frequency: 'daily' as 'daily' | 'weekly',
        occurrences: 2,
      };

      const result = await ReservationService.createRecurringReservations(data);

      expect(reservationRepository.create).toHaveBeenCalledTimes(2);
      expect(redisClient.flushAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });

    it('should throw AppError when conflict in any occurrence', async () => {
      const conflictReservation = {
        id: 2,
        room: 'A',
        user: 'X',
        startDate: new Date('2024-06-02T10:30:00Z'),
        endDate: new Date('2024-06-02T11:30:00Z'),
      };
      (reservationRepository.findAll as jest.Mock)
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [conflictReservation] });

      (reservationRepository.create as jest.Mock).mockResolvedValue(mockReservation);

      const data = {
        room: 'A',
        user: 'U',
        startDate: new Date('2024-06-01T10:00:00Z'),
        endDate: new Date('2024-06-01T11:00:00Z'),
        frequency: 'daily' as 'daily' | 'weekly',
        occurrences: 2,
      };

      await expect(ReservationService.createRecurringReservations(data)).rejects.toThrow(AppError);
      await expect(ReservationService.createRecurringReservations(data)).rejects.toMatchObject({ statusCode: 409 });
    });
  });
});