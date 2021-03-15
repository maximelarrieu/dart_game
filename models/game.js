'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Game.belongsTo(models.Player, {foreignKey: "currentPlayerId"}),
      Game.hasMany(models.GamePlayer, {foreignKey: "gameId"}),
      Game.hasMany(models.GameShot, {foreignKey: "gameId"})
    }
  };
  Game.init({
    mode: DataTypes.STRING,
    name: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Game',
  });
  
  Game.sync({force:true})
  return Game;
};