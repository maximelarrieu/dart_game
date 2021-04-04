const mongoose = require('mongoose');

const GamePlayerSchema = new mongoose.Schema({
  remainingShots : {
    type : Number,
  },
  score : {
    type : Number,
  },
  rank : {
    type : Number,
  },
  order : {
    type : Number,
  },
  inGame : {
    type : Boolean,
  },
  playerId : [
    {type: mongoose.Schema.Types.ObjectId,ref:'Player'}
  ],
  gameId: [
    {type: mongoose.Schema.Types.ObjectId,ref:'Game'}
  ],
})
module.exports = mongoose.model('GamePlayer', GamePlayerSchema);





// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class GamePlayer extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       GamePlayer.belongsTo(models.Player, {foreignKey: "playerId"}),
//       GamePlayer.belongsTo(models.Game, {foreignKey: "gameId"})
//     }
//   };
//   GamePlayer.init({
//     remainingShots: DataTypes.INTEGER,
//     score: DataTypes.INTEGER,
//     rank: DataTypes.INTEGER,
//     order: DataTypes.INTEGER,
//     inGame: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'GamePlayer',
//   });
//   // GamePlayer.sync()
//   return GamePlayer;
// };