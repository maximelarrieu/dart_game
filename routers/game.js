//const cors = require('cors')
const bodyParser = require('body-parser')

const sequelize = require('sequelize')
const Game = require('../models').Game
const GamePlayer = require('../models').GamePlayer
const GameShot = require('../models').GameShot
const Player = require('../models').Player

const troiscentun = require('../engine/gamemodes/301')

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = app => {
    let router = require('express').Router();

    router.get('/', function(req, res) {
        res.redirect(303, '/games/')
        res.json("406 API_NOT_AVAILABLE")
    })

    // Route qui liste toutes les parties créées
    router.get("/games", function(req, res) {
        Game.findAll()
            .then(function (games) {
                res.render('games/index.pug', {
                    title: 'Parties',
                    games: games
                })
            })
    });

    // Page de formulaire de création d'une partie
    router.get("/games/new", jsonParser, urlencodedParser, function(req, res) {
        console.log(req.body.select)
        res.render('games/new.pug', {
            game: Game
        })
    });

    // Route qui crée la partie et l'enregistre en base de données
    router.post("/games", jsonParser, urlencodedParser, function(req, res) {
        Game.create({
            mode: req.body.select,
            name: req.body.name
          })
          .then(function (game) {
            res.redirect(`/games/${game.id}`)
          });
    });

    // Page du détail d'une partie
    router.get("/games/:id", jsonParser, urlencodedParser, function(req, res) {
        const passedId = req.params.id
            Game.findAll({
                where: { 
                    id: passedId
                },
                include: [
                {
                    model: GamePlayer,
                    where: {
                        gameId: passedId
                    },
                    required: false,
                    include: [{
                        model: Player,
                        required: false,
                    }],
                },
                {
                    model: GameShot,
                    where: {
                        gameId: passedId
                    },
                    required: false
                }
            ],
            })
            .then(function (gp) {
                res.render('games/details.pug', {
                    game: gp,
                    id: passedId,
                    score: troiscentun.score
                })
            })
    });

    // Page du formulaire d'édition d'une partie
    router.get("/games/:id/edit", function(req, res) {
        const id = req.params.id
        Game.findByPk(id)
            .then(function (game) {
                res.render('games/edit.pug', {
                    game: game
                })
            })
    });

    // Route qui modifie et PATCH en base de données
    router.post("/games/:id", jsonParser, urlencodedParser, function(req, res) {
        Game.update({
            mode: req.body.select,
            name: req.body.name,
        },  {
            where: {id:req.params.id},
        })
        .then(function () {
            res.redirect(303, `/games/` + req.params.id)
        })
    })

    // Route qui supprime la partie en base de données
    router.post("/games/:id/delete", function(req, res) {        
        Game.destroy({
            force: true,
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect(303, '/games')
            });
    })

    // Page qui liste les joueurs et permet de les ajouter à une partie
    router.get("/games/:id/players", function (req, res) {
        const id = req.params.id
        Player.findAll({
            include: [{
                model: GamePlayer,
                include: {
                    model: Game,
                    attributes: ['id']
                }
            }]
        })
        .then(function(players) {
            res.render('games/players.pug', {
                players: players,
                id: id,
                result: req.query.nbPlayers
            })
        })
    })

    // Créer et enregistre les relations entre joueurs et parties
    router.post("/games/:id/players/", jsonParser, urlencodedParser, function (req, res) {
        for (let c in req.body.checked) {
            GamePlayer.create({
                include: [{
                    model: Player
                }],
                gameId: req.params.id,
                playerId: req.body.checked[c],
                remainingShots: troiscentun.nbDarts,
                score: troiscentun.score
            })
            .then(function() {
                let counter = GamePlayer.count({where:{gameId: req.params.id}})
                counter.then(function(result) {
                    console.log(result)
                    let test = encodeURIComponent(result)
                    res.redirect(303, `/games/${req.params.id}/players/?nbPlayers=${test}`)
                })
            })
        }
    })

    // Supprime un joueur d'une partie en base de données
    router.post("/games/:id/players/delete", jsonParser, urlencodedParser, function (req, res) {
        for (let c in req.body.checked) {
            GamePlayer.destroy({
                force: true,
                where: {
                    playerId: req.body.checked[c]
                }
            })
            .then(function() {
                let counter = GamePlayer.count({where:{gameId: req.params.id}})
                counter.then(function(result) {
                    console.log(result)
                    let test = encodeURIComponent(result)
                    res.redirect(`/games/${req.params.id}/players?nbPlayers=${test}`)
                })
            })
        }
    })

    // Créer un tir de joueur en base de données avec relation sur la partie
    router.post("/games/:id/shots", jsonParser, urlencodedParser, function (req, res) {
        let result = troiscentun.shot(req.body.shot)
        GameShot.create({
            sector: result,
            gameId: req.params.id,
            // playerId: 
        })
        .then(function(gs) {
            res.redirect(`/games/${gs.gameId}`)
        })
    })

    //ROUTE FACULTATIVE
    // router.delete("/games/:id/shots/previous", function () {

    // })

    app.use('/', router)
}