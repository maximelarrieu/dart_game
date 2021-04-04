const Game = require("../models/gameschema")

const getGames = async(req, res) => {
    const games = await Game.find({})
    res.render('games/index.pug', {
        title: "Liste des parties",
        games: games
    })
}

const getGame = async(req, res) => {
    const game = await Game.find({_id: req.params.id}).populate('gameplayer', 'name email')
    console.log(game[0])
    res.render('games/details.pug', {
        game: game[0],
        gameplayers: game[0].gameplayers
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

exports.getGames = getGames
exports.getGame = getGame
exports.addGame = addGame
exports.toEditGame = toEditGame
exports.editGame = editGame