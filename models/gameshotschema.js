const mongoose = require('mongoose');

const GameShotSchema = new mongoose.Schema({
  multiplicator : {
    type : Number
  },
  sector : {
    type : Number
  },
  playerId : [
    {type: mongoose.Schema.Types.ObjectId,ref:'Player'}
  ],
  gameId: [
    {type: mongoose.Schema.Types.ObjectId,ref:'Game'}
  ]
})

module.exports = mongoose.model('GameShot', GameShotSchema);


// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class GameShot extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       GameShot.belongsTo(models.Game, {foreignKey: "gameId"}),
//       GameShot.belongsTo(models.Player, {foreignKey: "playerId"})
//     }
//   };
//   GameShot.init({
//     multiplicator: DataTypes.INTEGER,
//     sector: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'GameShot',
//   });
  
//   // GameShot.sync({force:true})
//   return GameShot;
// };