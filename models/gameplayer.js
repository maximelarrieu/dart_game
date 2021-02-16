'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GamePlayer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // GamePlayer.belongsTo(models.Player)
    }
  };
  GamePlayer.init({
    remainingShots: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    inGame: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'GamePlayer',
  });
  // GamePlayer.sync()
  return GamePlayer;
};