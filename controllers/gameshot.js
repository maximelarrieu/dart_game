const GameShot = require('../models/gameshotschema')
const Game = require('../models/gameschema')

const troiscentun = require('../engine/gamemodes/301')

const addGameShot = async(req, res) => {
    const gameshot = new GameShot(req.body)
    try {
        const game = await Game.find({_id: req.params.id})
        gameshot.gameId = game._id
        console.log(game[0].currentPlayerId[0])
        gameshot.playerId = game[0].currentPlayerId[0]
        troiscentun.shot(req.params.id, req.body.sector, req.body.multiplicator, game[0].currentPlayerId[0])
        await gameshot.save()
        res.redirect(`/games/${req.params.id}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

exports.addGameShot = addGameShot