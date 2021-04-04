const Game = require("../models/gameschema")

const getGames = async(req, res) => {
    const games = await Game.find({})
    res.render('games/index.pug', {
        title: "Parties",
        games: games
    })
}

const getGame = async(req, res) => {
    const game = await Game.find({_id: req.params.id})
    console.log(game)
    res.render('games/details.pug', {
        game: game[0]
    })
}

const addGame = async (req, res) => {
    const game = new Game(req.body)

    try {
        await game.save()
        res.send(game)
    } catch(err) {
        res.status(500).send(err)
    }
}

exports.getGames = getGames
exports.getGame = getGame
exports.addGame = addGame