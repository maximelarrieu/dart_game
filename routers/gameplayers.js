const methodOverride = require('method-override')
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const gameplayerscontroller = require('../controllers/gameplayer')

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

    router.get("/games/:id/players", jsonParser, urlencodedParser, gameplayerscontroller.getAllPlayers)

    router.post("/games/:id/players", jsonParser, urlencodedParser, gameplayerscontroller.addGamePlayers)

    router.delete("/games/:id/players", jsonParser, urlencodedParser, gameplayerscontroller.deleteGamePlayers)

    app.use('/', router)
}