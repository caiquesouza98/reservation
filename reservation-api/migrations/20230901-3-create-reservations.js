"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reservations", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      room: { type: Sequelize.STRING, allowNull: false },
      user: { type: Sequelize.STRING, allowNull: false },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reservations");
  }
};
