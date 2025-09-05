"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Caique Souza",
        email: "caique@example.com",
        password: await bcrypt.hash("123456", 10),
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
