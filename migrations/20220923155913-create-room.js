'use strict';

const { UniqueConstraintError } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique: true
      },
      player_1_1: {
        type: Sequelize.STRING
      },
      player_1_2: {
        type: Sequelize.STRING
      },
      player_1_3: {
        type: Sequelize.STRING
      },
      player_2_1: {
        type: Sequelize.STRING
      },
      player_2_2: {
        type: Sequelize.STRING
      },
      player_2_3: {
        type: Sequelize.STRING
      },
      result: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};