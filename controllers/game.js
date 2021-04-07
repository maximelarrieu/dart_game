const Game = require("../models/gameschema")
const GamePlayer = require("../models/gameplayerschema")

const troiscentun = require('../engine/gamemodes/301')

const getGames = async(req, res) => {
    const games = await Game.find({})
    res.render('games/index.pug', {
        title: "Liste des parties",
        games: games
    })
}

const getGame = async(req, res) => {
    const game = await Game.findById({_id: req.params.id}).populate({
        path: 'gameplayers',
        model: 'GamePlayer',
        populate: {
            path: 'playerId',
            model: 'Player'
        }
    }).populate({
        path: 'currentPlayerId',
        model: 'Player',
    })

    const gameplayers = await GamePlayer.find({gameId: game._id})
    console.log(gameplayers)
    troiscentun.checkFinish(gameplayers).then(async(response) => {
        console.log("response")
        console.log(response)
        if (response === "finished") {
            console.log('true')
            game.status = 'ended'
            await game.save()
        }
    })

    
    res.render('games/details.pug', {
        game: game,
        gameplayers: game.gameplayers
    })
}

const addGame = async (req, res) => {
    const game = new Game(req.body)
    try {
        game.status = "drafted"
        game.gameplayers = []
        await game.save()
        res.redirect(`/games/${game._id}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

const toEditGame = async (req, res) => {
    const game = await Game.find({_id: req.params.id})
    console.log(game)
    res.render('games/edit.pug', {
        game: game[0]
    })
}

const editGame = async (req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body)
    try {
        await game.save()
        res.redirect(`/games/${game._id}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

const deleteGame = async (req, res) => {
    const game = await Game.findByIdAndDelete(req.params.id)
    if (!game) {
        res.status(404).send("Aucun partie trouvée.")
    }
    try {
    res.redirect(`/games`)
    res.status(200).send()
    } catch(err) {
        res.status(500).send(err)
    }

}

exports.getGames = getGames
exports.getGame = getGame
exports.addGame = addGame
exports.toEditGame = toEditGame
exports.editGame = editGame
exports.deleteGame = deleteGame