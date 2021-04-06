const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name : {
    type : String
  },
  email : {
    type : String
  },
  gameWin : {
    type : Number
  },
  gameLost : {
    type : Number
  },
  currentPlayerId : 
    {type: mongoose.Schema.Types.ObjectId,ref:'Game'}
  ,
  gameplayers: 
    {type: mongoose.Schema.Types.ObjectId,ref:'GamePlayer'}
  ,
  // playerId: [
  //   {type: mongoose.Schema.Types.ObjectId,ref:'GameShot'}
  // ]
})

module.exports = mongoose.model('Player', PlayerSchema);





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