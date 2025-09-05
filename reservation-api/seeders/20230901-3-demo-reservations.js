"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Reservations", [
      {
        roomId: 1,
        userId: 2,
        startDate: new Date("2025-09-01T10:00:00Z"),
        endDate: new Date("2025-09-01T11:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomId: 2,
        userId: 2,
        startDate: new Date("2025-09-02T14:00:00Z"),
        endDate: new Date("2025-09-02T15:00:00Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Reservations", null, {});
  }
};
