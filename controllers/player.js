const Player = require("../models/playerschema")

const getPlayers = async(req, res) => {
    const players = await Player.find({})
    res.render('players/index.pug', {
        title: 'Liste des joueurs',
        players: players
    })
}

const getPlayer = async(req, res) => {
    const player = await Player.find({_id: req.params.id})
    res.render('players/details.pug', {
        player: player[0]
    })
}

const addPlayer = async(req, res) => {
    const player = new Player(req.body)
    try {
        await player.save()
        res.redirect(`/players/${player._id}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

const toEditPlayer = async(req, res) => {
    const player = await Player.find({_id: req.params.id})
    res.render('players/edit.pug', {
        player: player[0]
    })
}

const editPlayer = async(req, res) =>  {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body)
    try {
        await player.save()
        res.redirect(`/players/${player._id}`)
    } catch(err) {
        res.status(500).send(err)
    }
}

const deletePlayer = async(req, res) => {
    const player = await Player.findByIdAndDelete(req.params.id)
    if (!player) {
        res.status(404).send("Aucun  joueur trouvé.")
    }
    res.redirect(`/players/`)
    res.status(200).send()
}

exports.getPlayer = getPlayer
exports.getPlayers = getPlayers
exports.addPlayer = addPlayer
exports.toEditPlayer = toEditPlayer
exports.editPlayer = editPlayer
exports.deletePlayer = deletePlayer