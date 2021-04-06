const GamePlayer = require("../models/gameplayerschema")
const Player = require("../models/playerschema")
const Game = require("../models/gameschema")
const game = require("../routers/game")

const mongoose = require('mongoose')

const troiscentun = require('../engine/gamemodes/301')

const getAllPlayers = async(req, res) => {
    const allPlayers = await Player.find({}).populate({
        path: 'gameplayers',
        model: 'GamePlayer', 
        populate: {
            path: 'playerId',
            model: 'Player'
        }   
    })
    const game = await Game.findOne({_id:req.params.id}).populate({
        path:'gameplayers',
        model: 'GamePlayer',
        populate: {
            path: 'playerId',
            model: 'Player'
        }
    })
    const gamePlayers = await GamePlayer.find({gameId: req.params.id}).populate({
        path: 'playerId',
        model: 'Player'
    })
    console.log(game.gameplayers)
    res.render('games/players.pug', {
        players: allPlayers,
        gameplayers: game.gameplayers,
        game: game
    })
}

const addGamePlayers = async(req, res) => {
    const select = req.body
    const gameplayer = new GamePlayer(select)
    await Player.findOneAndUpdate({_id: gameplayer.playerId}, {$set: {gameplayers: gameplayer}}, {new: true})
    gameplayer.gameId = req.params.id
    gameplayer.score = troiscentun.score
    gameplayer.remainingShots = troiscentun.nbDarts
    await gameplayer.save()
    troiscentun.startGame(req.params.id).then(async(response) => {
        console.log(mongoose.Types.ObjectId.isValid(req.params.id));
        const game = await Game.findByIdAndUpdate({_id: req.params.id}, {$set: {gameplayers: [gameplayer._id], currentPlayerId: response}}, {new: true})
        await game.save()
    })
    res.redirect(`/games/${game._id}/players`)
}

const deleteGamePlayers = async(req, res) => {
    const gameplayer = await GamePlayer.findByIdAndDelete(req.body)
    const game = await Game.findOneAndUpdate({_id: req.params.id}, {$pullAll: gameplayer._id}, {new: true})

    console.log(game)
    if (!gameplayer) {
        res.status(404).send("Aucun gameplayer trouvé.")
    }
    res.status(200).send()
    // res.redirect(`/games/${req.params.id}/players`)
}

exports.getAllPlayers = getAllPlayers
exports.addGamePlayers = addGamePlayers
exports.deleteGamePlayers = deleteGamePlayers