'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameShot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GameShot.init({
    multiplicator: DataTypes.INTEGER,
    sector: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GameShot',
  });
  return GameShot;
};