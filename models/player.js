'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Player.hasMany(models.Game)
    }
  };
  Player.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gameWin: DataTypes.INTEGER,
    gameLost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player',
  });
  
  Player.sync({force:true})
  return Player;
};