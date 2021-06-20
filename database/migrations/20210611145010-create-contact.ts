"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("contacts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contactInitiator: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactRecipient: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactInitiatorPhotoUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactRecipientPhotoUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("contacts");
  },
};
