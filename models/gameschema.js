const mongoose = require('mongoose');
const Schema = mongoose.Schema
console.log(Schema.Types.ObjectId)

const GameSchema = new mongoose.Schema({
  name : {
    type : String,
    required: true,
    lowercase: true,
  },
  mode : {
    type : String,
    required: true,
    lowercase: true,
  },
  status : {
    type: String,
    required: true,
    lowercase: true
  },
  gameplayers: [], 
  currentPlayerId : 
    {type: mongoose.Schema.Types.ObjectId,ref:'Player'}
  ,
  // gameId: [
  //   {type: mongoose.Schema.Types.ObjectId,ref:'GamePlayer'}
  // ],
  // gameId: [
  //   {type: mongoose.Schema.Types.ObjectId,ref:'GameShot'}
  // ]
})

const GameModel = mongoose.model('Game', GameSchema)

module.exports = GameModel



// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Game extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       Game.belongsTo(models.Player, {foreignKey: "currentPlayerId"}),
//       Game.hasMany(models.GamePlayer, {foreignKey: "gameId"}),
//       Game.hasMany(models.GameShot, {foreignKey: "gameId"})
//     }
//   };
//   Game.init({
//     mode: DataTypes.STRING,
//     name: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Game',
//   });
  
//   Game.sync({force:true})
//   return Game;
// };