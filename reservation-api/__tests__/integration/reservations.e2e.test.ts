import request from "supertest";
import app from "../../src/app";
import sequelize  from "../../src/config/database";
import Reservation from "../../src/models/reservation.model";

describe("Reservation API Integration", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /reservations", () => {
    it("should create a reservation", async () => {
      const res = await request(app)
        .post("/reservations")
        .send({
          room: "A",
          user: "U1",
          startDate: "2025-09-02T10:00:00.000Z",
          endDate: "2025-09-02T11:00:00.000Z"
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.room).toBe("A");
    });

    it("should not create a reservation with conflicting time", async () => {
      await Reservation.create({
        room: "A",
        user: "U2",
        startDate: "2025-09-02T10:30:00.000Z",
        endDate: "2025-09-02T11:30:00.000Z"
      });

      const res = await request(app)
        .post("/reservations")
        .send({
          room: "A",
          user: "U3",
          startDate: "2025-09-02T11:00:00.000Z",
          endDate: "2025-09-02T12:00:00.000Z"
        });
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /reservations", () => {
    it("should list reservations", async () => {
      const res = await request(app).get("/reservations");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("PUT /reservations/:id", () => {
    it("should update a reservation", async () => {
      const reservation = await Reservation.create({
        room: "B",
        user: "U4",
        startDate: "2025-09-03T10:00:00.000Z",
        endDate: "2025-09-03T11:00:00.000Z"
      });

      const res = await request(app)
        .put(`/reservations/${reservation.id}`)
        .send({ endDate: "2025-09-03T12:00:00.000Z" });

      expect(res.status).toBe(200);
      expect(res.body.endDate).toBe("2025-09-03T12:00:00.000Z");
    });
  });

  describe("DELETE /reservations/:id", () => {
    it("should cancel a reservation", async () => {
      const reservation = await Reservation.create({
        room: "C",
        user: "U5",
        startDate: "2025-09-04T10:00:00.000Z",
        endDate: "2025-09-04T11:00:00.000Z"
      });

      const res = await request(app).delete(`/reservations/${reservation.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /reservations/recurring", () => {
    it("should create recurring reservations", async () => {
      const res = await request(app)
        .post("/reservations/recurring")
        .send({
          room: "D",
          user: "U6",
          startDate: "2025-09-05T10:00:00.000Z",
          endDate: "2025-09-05T11:00:00.000Z",
          frequency: "daily",
          occurrences: 3
        });
      expect(res.status).toBe(201);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });
  });
});