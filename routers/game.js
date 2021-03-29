//const cors = require('cors')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const sequelize = require('sequelize')
const Game = require('../models').Game
const GamePlayer = require('../models').GamePlayer
const GameShot = require('../models').GameShot
const Player = require('../models').Player

const troiscentun = require('../engine/gamemodes/301')

// app.use(methodOverride('_method'))
var test = methodOverride('_method')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = app => {
    let router = require('express').Router();

    router.use(function(req, res, next) {
        if(req.query._method == "DELETE") {
            req.method = "DELETE";
            req.url = req.path
        } else if (req.query._method == "PATCH") {
            req.method = "PATCH"
            req.url = req.path
        }
        next();
    })

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
            name: req.body.name,
            status: 'draft'
          })
          .then(function (game) {
            res.redirect(`/games/${game.id}`)
          });
    });

    // Page du détail d'une partie
    router.get("/games/:id", jsonParser, urlencodedParser, function(req, res) {
        const passedId = req.params.id
            Game.findByPk(passedId, {
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
                    raw:true,
                    nest:true
                },
                {
                    model: GameShot,
                    where: {
                        gameId: passedId
                    },
                    required: false
                },
            ],
            // raw: true,
            nest: true
            })
            .then(function (g) {
                console.log(g)
                let name = g.name
                let mode = g.mode
                let gameplayers = g.GamePlayers
                let currentPlayerId = g.currentPlayerId
                
                if (currentPlayerId != null) {
                    Player.findByPk(currentPlayerId, {})
                    .then((p) => {
                        console.log("JOUEUR CURRENT")
                        console.log(p)
                        let current_name = p.name
                        res.render('games/details.pug', {
                            game: g,
                            id: passedId,
                            name: name,
                            mode: mode,
                            gameplayers: gameplayers,
                            currentPlayerId: currentPlayerId,
                            current_name: current_name
                        })
                    })
                    GamePlayer.findOne({
                        where: {playerId: currentPlayerId}
                    })
                    .then((current) => {
                        let nbDarts = current.remainingShots
                        let score = current.score
                        console.log(nbDarts)
                        if (nbDarts == 0) {
                            console.log("UH OH")
                            console.log(troiscentun.randomize(g.id))
                            troiscentun.randomize(g.id, currentPlayerId).then(response => {
                                Game.update({
                                    currentPlayerId: response
                                },
                                {
                                    where: {
                                        id: g.id
                                    }
                                })
                                GamePlayer.update({
                                    remainingShots: 3
                                },
                                {
                                    where: {
                                        playerId: currentPlayerId
                                    }
                                })
                            })
                        }
                    })
                } else {
                    res.render('games/details.pug', {
                        game: g,
                        id: passedId,
                        name: name,
                        mode: mode,
                        gameplayers: gameplayers,
                        currentPlayerId: currentPlayerId,
                    })
                }
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
    router.patch("/games/:id", jsonParser, urlencodedParser, function(req, res) {
        Game.update({
            mode: req.body.select,
            name: req.body.name,
            status: req.body.status
        },  {
            where: {id:req.params.id},
        })
        .then(function () {
            res.redirect(303, `/games/` + req.params.id)
        })
    })

    // Route qui supprime la partie en base de données
    router.delete("/games/:id", jsonParser, urlencodedParser, function(req, res) {        
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
            GamePlayer.findAll({
                where: {
                    gameId: id
                },
                include: [{
                    model: Player
                }],
                raw: true,
                nest: true
            })
            .then( (gameplayers) => {
                res.render('games/players.pug', {
                    players: players,
                    gameplayers: gameplayers,
                    id: id,
                    result: req.query.nbPlayers
                })
            })

        })
    })

    // Créer et enregistre les relations entre joueurs et parties
    router.post("/games/:id/players/", jsonParser, urlencodedParser, function (req, res) {
        for (let c in req.body.checked) {
            GamePlayer.create({
                include: [
                   {
                        model: Player
                    }
            ], 
                gameId: req.params.id,
                playerId: req.body.checked[c],
                remainingShots: troiscentun.nbDarts,
                score: troiscentun.score,
                inGame: true
            })

            // .then(function(gp) {
                .then(function() {
                    Game.findByPk(req.params.id, {})
                    troiscentun.startGame(req.params.id).then(response => {
                        Game.update({
                            currentPlayerId: response
                        },
                        {
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(function() {
                            res.redirect(303, `/games/${req.params.id}/players`)
                        })
                    })
                    
                })
                // counter.then(function(result) {
                //     console.log(result)
                //     let test = encodeURIComponent(result)
                //     res.redirect(303, `/games/${req.params.id}/players`)
                // })
            // })s
        }
    })

    // Supprime un joueur d'une partie en base de données
    router.delete("/games/:id/players", jsonParser, urlencodedParser, function (req, res) {
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
        // troiscentun.shot(req.params.id, req.body.shot, ).then(response => {
            const id = req.params.id
            Game.findByPk(id)
            .then(function(gs) {
                console.log(gs)
                let player = gs.currentPlayerId
                troiscentun.shot(req.params.id, req.body.shot, req.body.multiplicator, gs.currentPlayerId)
                // troiscentun.randomize(gs.playerId)
                res.redirect(`/games/${req.params.id}`)
            })
    })
        // troiscentun.shot(req.params.id, req.body.shot, test

    //ROUTE FACULTATIVE
    // router.delete("/games/:id/shots/previous", function () {

    // })

    app.use('/', router)
}