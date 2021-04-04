const GamePlayer = require("../models/gameplayerschema")
const Player = require("../models/playerschema")
const Game = require("../models/gameschema")
const game = require("../routers/game")

const getAllPlayers = async(req, res) => {
    const allPlayers = await Player.find({})
    const game = await Game.find({_id:req.params.id})
    const gamePlayers = await GamePlayer.find({gameId: req.params.id}).populate({
        path: 'playerId',
        model: 'Player'
    })
    console.log(game)
    res.render('games/players.pug', {
        players: allPlayers,
        gameplayers: gamePlayers,
        game: game[0]
    })
}

const addGamePlayers = async(req, res) => {
    const gameplayer = new GamePlayer(req.body)
    console.log(req.body)
    
    try {
        // for (let c in req.body.checked) {
            console.log("test")
            gameplayer.gameId = req.params.id
            console.log(gameplayer._id)
            // gameplayer.playerId = req.body.checked[c]
            console.log("a")
            game.gameplayers.push(gameplayer._id)

            // await gameplayer.save()
            res.redirect(303, `/games/${gameplayer.gameId}/players`)
        // }
    } catch(err) {
        res.status(500).send(err)
    }
}

exports.getAllPlayers = getAllPlayers
exports.addGamePlayers = addGamePlayers