const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name : {
    type : String
  },
  email : {
    type : String
  },
  gameWin : {
    type : INTEGER
  },
  gameLost : {
    type : INTEGER
  },
  currentPlayerId : [
    {type: mongoose.Schema.Types.ObjectId,ref:'Game'}
  ],
  playerId: [
    {type: mongoose.Schema.Types.ObjectId,ref:'GamePlayer'}
  ],
  playerId: [
    {type: mongoose.Schema.Types.ObjectId,ref:'GameShot'}
  ]
})

module.exports = mongoose.model('Player', GameSchema);





// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Player extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       Player.hasMany(models.Game, {foreignKey: "currentPlayerId"}),
//       Player.hasMany(models.GamePlayer, {foreignKey: "playerId"}),
//       Player.hasMany(models.GameShot, {foreignKey: "playerId"})
//     }
//   };
//   Player.init({
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     gameWin: DataTypes.INTEGER,
//     gameLost: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Player',
//   });
  
//   Player.sync({force:true})
//   return Player;
// };