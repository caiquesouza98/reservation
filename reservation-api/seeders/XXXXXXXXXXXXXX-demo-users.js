"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "Caique Souza",
        email: "caique@example.com",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Maria Silva",
        email: "maria@example.com",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
