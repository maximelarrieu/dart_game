const GameShot = require('../models/gameshotschema')
const Game = require('../models/gameschema')
const GamePlayer = require('../models/gameplayerschema')

const troiscentun = require('../engine/gamemodes/301')
const around_the_world = require('../engine/gamemodes/around-the-world')

const addGameShot = async(req, res) => {
    const gameshot = new GameShot(req.body)
    try {
        const game = await Game.findById({_id: req.params.id}).populate({
            path: 'currentPlayerId',
            model: 'Player',
            populate: {
                path: 'gameplayers',
                model: 'GamePlayer'
            }
        })
        gameshot.gameId = game._id
        gameshot.playerId = game.currentPlayerId._id
        const current_gameplayer = game.currentPlayerId.gameplayers
        const gameplayer_id = game.currentPlayerId.gameplayers._id
        const gameplayer_score = game.currentPlayerId.gameplayers.score
        const gameplayer_remainingShots = game.currentPlayerId.gameplayers.remainingShots
        if (game.mode === "301") {
            troiscentun.shot(req.body.sector, req.body.multiplicator, current_gameplayer).then(async(response) => {
                console.log(response)
                const gameplayer = await GamePlayer.findByIdAndUpdate(current_gameplayer._id, {
                    $set: {score: response.new_score, remainingShots: response.new_shots}
                })
                gameplayer.save()
            })
        } else if (game.mode === "around-the-world") {
            around_the_world.ifNext(req.body.sector, gameplayer_score).then(async(response) => {
                if(response === true) {
                    const gameplayer = await GamePlayer.findByIdAndUpdate(gameplayer_id, {
                        $set: {score: gameplayer_score + 1, remainingShots: gameplayer_remainingShots - 1}
                    })
                    await gameplayer.save()
                } else {
                    const gameplayer = await GamePlayer.findByIdAndUpdate(gameplayer_id, {
                        $set: {remainingShots: gameplayer_remainingShots - 1}
                    })
                    await gameplayer.save()                }
            })

        }
        await gameshot.save()
        res.redirect(`/games/${req.params.id}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

exports.addGameShot = addGameShot