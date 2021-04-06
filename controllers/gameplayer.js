const GamePlayer = require("../models/gameplayerschema")
const Player = require("../models/playerschema")
const Game = require("../models/gameschema")
const game = require("../routers/game")

const mongoose = require('mongoose')

const troiscentun = require('../engine/gamemodes/301')
const GameMode = require('../engine/gamemode')
const around_the_world = require('../engine/gamemodes/around-the-world')

const gamemode = new GameMode()

const getAllPlayers = async(req, res) => {

    const game = await Game.findOne({_id:req.params.id}).populate({
        path:'gameplayers',
        model: 'GamePlayer',
        populate: {
            path: 'playerId',
            model: 'Player'
        }
    })
    const allPlayers = await Player.find({'gameplayers.gameId': {"$ne" : game._id}})
    await Player.populate(allPlayers, {
        path: 'gameplayers',
        model: 'GamePlayer'
    })
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
    const current_game = await Game.findById({_id: req.params.id})
    if(current_game.mode === '301') {
        gameplayer.score = troiscentun.score
    } else if (current_game.mode === 'around-the-world') {
        gameplayer.score = around_the_world.score
    }
    gameplayer.remainingShots = gamemode.nbDarts
    await gameplayer.save()
    const gameplayers = await GamePlayer.find({gameId: req.params.id})
    gamemode.startGame(gameplayers).then(async(response) => {
        const game = await Game.findByIdAndUpdate({_id: req.params.id}, {$set: {currentPlayerId: response}}, {new: true})
        game.gameplayers.push(gameplayer._id)
        await game.save()
        res.redirect(`/games/${game._id}/players`)
    })
}

const deleteGamePlayers = async(req, res) => {
    const gameplayer = await GamePlayer.findByIdAndDelete(req.body)
    const game = await Game.findOneAndUpdate({_id: req.params.id}, {$pullAll: gameplayer._id}, {new: true})

    console.log(game)
    if (!gameplayer) {
        res.status(404).send("Aucun gameplayer trouvé.")
    }
    res.status(200).send()
    res.redirect(`/games/${req.params.id}/players`)
}

exports.getAllPlayers = getAllPlayers
exports.addGamePlayers = addGamePlayers
exports.deleteGamePlayers = deleteGamePlayers