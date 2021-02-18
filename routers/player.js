//const cors = require('cors')
const bodyParser = require('body-parser')

const Player = require('../models').Player

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

    router.get("/players", function(req, res) {
        Player.findAll()
            .then(function (players) {
                res.render('players/index.pug', {
                    title: 'Joueurs',
                    players: players
                })
            })
    });

    router.post("/players", jsonParser, urlencodedParser, function(req, res) {
        Player.create({
            name: req.body.name,
            email: req.body.email
          })
          .then(function (player) {
            res.redirect(`/api/players/${player.id}`)
          });
    });

    router.get("/players/new", function(req, res) {
        res.render('players/new.pug', {
            player: Player
        })
    });

    router.get("/players/:id", function(req, res) {
        const id = req.params.id
        Player.findByPk(id)
            .then(function (Player) {
                res.render('players/details.pug', {
                    player: Player
                })
            })
    });

    router.get("/players/:id/edit", function(req, res) {
        const id = req.params.id
        Player.findByPk(id)
            .then(function (player) {
                res.render('players/edit.pug', {
                    player: player
                })
            })
    });

    router.post("/players/:id", jsonParser, urlencodedParser, function(req, res) {
        Player.update({
            name: req.body.name,
            email: req.body.email
        },  {
            where: {
                id: req.params.id
            }
        })
        .then(function () {
            res.redirect('/api/players/' + req.params.id)
        });
    });

    router.post("/players/:id/delete", function(req, res) {
        Player.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect('/api/players')
            });
    });

    app.use('/api', router)
}