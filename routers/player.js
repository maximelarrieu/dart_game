//const cors = require('cors')
const bodyParser = require('body-parser')

const Player = require('../models/player')

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

    router.get("/players", function() {
        Player.findAll()
            .then(function (players) {
                res.render('players/index', {
                    title: 'Joueurs',
                    players: players
                })
            })
    });

    router.post("/players", function() {
        Player.create({
            name: req.body.name,
          })
          .then(function () {
            res.redirect('/players/' + req.params.id)
          });
    });

    router.get("/players/new", function() {
        res.render('players/new', {
            player: Player
        })
    });

    router.get("/players/:id", function() {
        Player.findByPk(id)
            .then(function (Player) {
                res.render('players/details', {
                    player: Player
                })
            })
    });

    router.get("/players/:id/edit", function() {
        res.render('/players/' + req.params.id + "/edit", {
            id: req.params.id
        })
    });

    router.patch("/players/:id", function() {
        Player.update({
            name: req.body.name,
        },  {
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect('/players/' + req.params.id, {
                    id: req.params.id
                })
            });
    });

    router.delete("/players/:id", function() {
        Player.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect('/players/index')
            });
    });

    app.use('/api', router)
}