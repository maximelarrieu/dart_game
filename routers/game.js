//const cors = require('cors')
const bodyParser = require('body-parser')

const Game = require('../models').Game
const GamePlayer = require('../models').GamePlayer
const Player = require('../models').Player

const troiscentun = require('../engine/gamemodes/301')
// let t_c_u = new troiscentun

// const corsOptions = {
//  origin: 'http://localhost:3000',
//  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//}

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = app => {
    //const game = require("../engine/EventController");

    let router = require('express').Router();

    router.get('/', function(req, res) {
        res.redirect(303, '/api/games/')
        res.json("406 API_NOT_AVAILABLE")
    })

    router.get("/games", function(req, res) {
        Game.findAll()
            .then(function (games) {
                console.log(games)
                res.render('games/index.pug', {
                    
                    title: 'Parties',
                    games: games
                })
            })
    });

    router.get("/games/new", jsonParser, urlencodedParser, function(req, res) {
        console.log(req.body.select)
        res.render('games/new.pug', {
            game: Game
        })
    });

    router.post("/games", jsonParser, urlencodedParser, function(req, res) {
        Game.create({
            mode: req.body.select,
            name: req.body.name
          })
          .then(function (game) {
            res.redirect(`/api/games/${game.id}`)
          });
    });

    router.get("/games/:id", function(req, res) {
        const id = req.params.id
        Game.findByPk(id)
            .then(function (Game) {
                res.render('games/details.pug', {
                    game: Game
                })
            })
    });

    router.get("/games/:id/edit", function(req, res) {
        const id = req.params.id
        Game.findByPk(id)
            .then(function (game) {
                res.render('games/edit.pug', {
                    game: game
                })
            })


    });

    router.post("/games/:id", jsonParser, urlencodedParser, function(req, res) {
        Game.update({
            mode: req.body.select,
            name: req.body.name,
        },  {
            where: {id:req.params.id},
        })
        .then(function () {
            res.redirect(303, `/api/games/` + req.params.id)
        })
    })

    router.post("/games/:id/delete", function(req, res) {        
        Game.destroy({
            force: true,
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect(303, '/api/games')
            });
    })

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
    router.post("/games/:id/players/", jsonParser, urlencodedParser, function (req, res) {
        for (let c in req.body.checked) {
            GamePlayer.create({
                include: [{
                    model: Player
                }],
                gameId: req.params.id,
                playerId: req.body.checked[c],
                remainingShots: troiscentun.nbDarts
            })
            .then(function() {
                let counter = GamePlayer.count({where:{gameId: req.params.id}})
                counter.then(function(result) {
                    console.log(result)
                    let test = encodeURIComponent(result)
                    res.redirect(303, `/api/games/${req.params.id}/players/?nbPlayers=${test}`)
                })
                // console.log(gp)
                // console.log("id = " + gp.gameId)
                // console.log("length = " + gp.length)
                // let test = encodeURIComponent(gp)
                // console.log(test)
            })
        }
    })

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
                    res.redirect(`/api/games/${req.params.id}/players?nbPlayers=${test}`)
                })
            })
        }
    })

    router.post("/games/:id/shots", function (req, res) {

    })

    //ROUTE FACULTATIVE
    // router.delete("/games/:id/shots/previous", function () {

    // })

    app.use('/api', router)
}