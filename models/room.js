'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.user, {through: 'user_room', foreignKey: 'roomId', otherKey: 'userId'})
    }
  }
  room.init({
    name: DataTypes.STRING,
    player_1_1: DataTypes.STRING,
    player_1_2: DataTypes.STRING,
    player_1_3: DataTypes.STRING,
    player_2_1: DataTypes.STRING,
    player_2_2: DataTypes.STRING,
    player_2_3: DataTypes.STRING,
    result: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'room',
  });
  return room;
};