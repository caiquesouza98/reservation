"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Rooms", [
      { name: "Sala 1", capacity: 10, createdAt: new Date(), updatedAt: new Date() },
      { name: "Sala 2", capacity: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: "Sala 3", capacity: 20, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Rooms", null, {});
  }
};
