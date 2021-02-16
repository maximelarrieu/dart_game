
//const cors = require('cors')
const bodyParser = require('body-parser')
const { GEOMETRY } = require('sequelize/types')

const Game = require('../models/game')

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

    router.get("/games", function() {
        Game.findAll()
            .then(function (games) {
                res.render('games/index', {
                    title: 'Parties',
                    games: games
                })
            })
    });

    router.get("/games/new", function() {
        res.render('games/new', {
            game: Game
        })
    });

    router.post("/games", function() {
        Game.create({
            name: req.body.name,
          })
          .then(function () {
            res.redirect('/games/' + req.params.id)
          });
    });

    router.get("/games/:id", function() {
        Game.findByPk(id)
            .then(function (Game) {
                res.render('games/details', {
                    game: Game
                })
            })
    });

    router.get("/games/:id/edit", function() {
        res.render('/games/' + req.params.id + "/edit", {
            id: req.params.id
        })

    });

    router.patch("/games/:id", function() {
        Game.update({
            name: req.body.name,
        },  {
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect('/games/' + req.params.id, {
                    id: req.params.id
                })
            });
    })

    router.delete("/games/:id", function() {
        Game.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect('/games/index')
            });
    })

    router.get("/games/:id/players", function () {
        Game.findByPk(id)
            .then(function (Game) {
                res.render('games/players', {
                    players: Game.Players
                })
            })
    })

    router.post("/games/:id/players", function () {
        Game.update
    })

    router.delete("/games/:id/players", function () {
        Game.destroy() 
    })

    router.post("/games/:id/shots", function () {

    })

    //ROUTE FACULTATIVE
    // router.delete("/games/:id/shots/previous", function () {

    // })

    app.use('/api', router)
}