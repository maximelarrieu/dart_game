const GameShot = require('../models/gameshotschema')
const Game = require('../models/gameschema')
const GamePlayer = require('../models/gameplayerschema')

const troiscentun = require('../engine/gamemodes/301')
const around_the_world = require('../engine/gamemodes/around-the-world')

const GameMode = require('../engine/gamemode')
const gamemode = new GameMode()

const addGameShot = async(req, res) => {
    const gameshot = new GameShot(req.body)
    try {
        await gameshot.save()
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
                const gameplayer = await GamePlayer.findByIdAndUpdate(current_gameplayer._id, {
                    $set: {score: response.new_score, remainingShots: response.new_shots}
                })
                gameplayer.save()
                troiscentun.checkScore(response.new_score, req.body.multiplicator).then(async(resp) => {
                    checkDarts(gameplayer)
                    if (resp === "0") {
                        await GamePlayer.findById(gameplayer._id).populate({
                            path: 'playerId',
                            model: 'Player'
                        })
                        
                        const gameplayers = await GamePlayer.find({gameId: gameplayer.gameId, inGame: true})
                        troiscentun.checkFinish(gameplayers).then(async(response) => {
                            if (response === true) {
                                game.status = 'ended'
                                game.save()
                            } else {
                                game.status = 'drafted'
                                game.save()
                            }    
                        })
                        gamemode.setOrder(gameplayers, JSON.stringify(gameplayer.playerId._id)).then(async(response) => {
                            const new_player = JSON.parse(response)
                            const game = await Game.findByIdAndUpdate(gameplayer.gameId, {currentPlayerId: new_player})
                            game.save()
                            gameplayer.inGame = false
                            await gameplayer.save()
                        })
                    } else if (resp === "fail") {
                        await GamePlayer.findByIdAndUpdate(gameplayer._id, {score: gameplayer.score})
                        // gameplayer.save()
                    }
                })
                res.redirect(`/games/${req.params.id}`)
            })
        } else if (game.mode === "around-the-world") {
            if (gameplayer_score === 20) {
                around_the_world.isLast(req.body.sector, gameplayer_score).then(async(response) => {
                    if (response === true) {
                        const gameplayer = await GamePlayer.findByIdAndUpdate(gameplayer_id, {
                            $set: {inGame: false, score: 25}
                        })
                        await gameplayer.save()
                        const gameplayers = await GamePlayer.find({gameId: gameplayer.gameId})
                        around_the_world.checkFinish(gameplayers).then((response) => {
                            if (response === true) {
                                game.status = 'ended'
                                game.save()
                            } else {
                                game.status = 'drafted'
                                game.save()
                            }
                        })
                        gamemode.setOrder(gameplayers, JSON.stringify(gameplayer.playerId._id)).then(async(response) => {
                            console.log(response)
                            const new_player = JSON.parse(response)
                            const game = await Game.findByIdAndUpdate(gameplayer.gameId, {currentPlayerId: new_player})
                            game.save()
                            gameplayer.inGame = false
                            await gameplayer.save()
                        })
                        res.redirect(`/games/${req.params.id}`)
                    } else {
                        const gameplayer = await GamePlayer.findByIdAndUpdate(gameplayer_id, {
                            $set: {remainingShots: gameplayer_remainingShots - 1}
                        })
                        await gameplayer.save()
                        checkDarts(gameplayer)
                        res.redirect(`/games/${req.params.id}`)
                    }
                })
            } else {
                around_the_world.ifNext(req.body.sector, gameplayer_score).then(async(response) => {
                    if(response === true) {
                        const gameplayer = await GamePlayer.findByIdAndUpdate(gameplayer_id, {
                            $set: {score: gameplayer_score + 1, remainingShots: gameplayer_remainingShots - 1}
                        })
                        gameplayer.save()
                        checkDarts(gameplayer)
                        res.redirect(`/games/${req.params.id}`)
                    } else {
                        const gameplayer = await GamePlayer.findByIdAndUpdate(gameplayer_id, {
                            $set: {remainingShots: gameplayer_remainingShots - 1}
                        })
                        await gameplayer.save()
                        checkDarts(gameplayer)
                        res.redirect(`/games/${req.params.id}`)
                    }
                })
            }
        }
    } catch(err) {
        res.status(500).send(err)
    }
}

const checkDarts = async (gameplayer) => {
    if((gameplayer.remainingShots - 1) === 0) {
        const reseted_gameplayer = await GamePlayer.findByIdAndUpdate({_id: gameplayer._id}, {$set: {remainingShots: gamemode.nbDarts}}).populate({
            path: 'playerId',
            model: 'Player'
        })
        reseted_gameplayer.save()
        const gameplayers = await GamePlayer.find({gameId: gameplayer.gameId, inGame: true})
        gamemode.setOrder(gameplayers, JSON.stringify(reseted_gameplayer.playerId._id)).then(async(response) => {
            const new_player = JSON.parse(response)
            const game = await Game.findByIdAndUpdate(gameplayer.gameId, {currentPlayerId: new_player})
            game.save()
        })
    }
} 

exports.addGameShot = addGameShot