//const cors = require('cors')
const bodyParser = require('body-parser')

const Player = require('../models').Player

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

    // Page qui liste les joueurs créées en base de données
    router.get("/players", function(req, res) {
        Player.findAll()
            .then(function (players) {
                res.render('players/index.pug', {
                    title: 'Joueurs',
                    players: players
                })
            })
    });

    // Route qui crée un joueur et l'enregistre en base de données
    router.post("/players", jsonParser, urlencodedParser, function(req, res) {
        Player.create({
            name: req.body.name,
            email: req.body.email
          })
          .then(function (player) {
            res.redirect(`/players/${player.id}`)
          });
    });

    // Page du formulaire de création de joueur
    router.get("/players/new", function(req, res) {
        res.render('players/new.pug', {
            player: Player
        })
    });

    // Page de détails d'un joueur
    router.get("/players/:id", function(req, res) {
        const id = req.params.id
        Player.findByPk(id)
            .then(function (Player) {
                res.render('players/details.pug', {
                    player: Player
                })
            })
    });

    // Page du formulaire d'édition d'un joueur
    router.get("/players/:id/edit", function(req, res) {
        const id = req.params.id
        Player.findByPk(id)
            .then(function (player) {
                res.render('players/edit.pug', {
                    player: player
                })
            })
    });

    // Route qui modifie et PATCH un joueur en base de données
    router.patch("/players/:id", jsonParser, urlencodedParser, function(req, res) {
        Player.update({
            name: req.body.name,
            email: req.body.email
        },  {
            where: {
                id: req.params.id
            }
        })
        .then(function () {
            res.redirect('/players/' + req.params.id)
        });
    });

    // Route qui supprime un joueur en base de données
    router.delete("/players/:id", function(req, res) {
        Player.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                res.redirect('/players')
            });
    });

    app.use('/', router)
}