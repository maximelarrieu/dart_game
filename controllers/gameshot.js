const GameShot = require('../models/gameshotschema')
const Game = require('../models/gameschema')

const troiscentun = require('../engine/gamemodes/301')
const around_the_world = require('../engine/gamemodes/around-the-world')

const addGameShot = async(req, res) => {
    const gameshot = new GameShot(req.body)
    try {
        const game = await Game.find({_id: req.params.id})
        const game_test = await Game.findById({_id: req.params.id}).populate({
            path: 'currentPlayerId',
            model: 'Player',
            populate: {
                path: 'gameplayers',
                model: 'GamePlayer'
            }
        })
        console.log("GAME TEST")
        console.log(game_test)
        console.log(game_test._id)
        gameshot.gameId = game_test._id
        console.log(game_test.currentPlayerId._id)
        gameshot.playerId = game_test.currentPlayerId._id
        console.log(game_test.currentPlayerId.gameplayers.score)
        if (game_test.mode === "301") {
            troiscentun.shot(req.params.id, req.body.sector, req.body.multiplicator, game[0].currentPlayerId[0])
        } else if (game_test.mode === "around-the-world") {
            around_the_world.ifNext(req.body.sector, game_test.currentPlayerId.gameplayers.score)
        }
        await gameshot.save()
        res.redirect(`/games/${req.params.id}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

exports.addGameShot = addGameShot