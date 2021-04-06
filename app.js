const express = require('express')
const methodOverride = require('method-override');
const SequelizeSimpleCache = require('sequelize-simple-cache')
const app = express();
const port = 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const GameMode = require('./engine/gamemode');
const trois_cent_un = require('./engine/gamemodes/301');
const GameMode301 = require('./engine/gamemodes/301');
const { sequelize } = require('./models');

const cache = new SequelizeSimpleCache({
    Player: {ttl: 1 * 60},
    Game: {ttl: 1 * 60},
    GameShot: {ttl: 1 * 60},
    GamePlayer : {ttl: 1 * 60}
})

cache.clear()

require("./routers/game")(app);
require("./routers/player")(app);
require("./routers/gameplayers")(app);
require("./routers/gameshot")(app);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(methodOverride('_method'))

mongoose.connect("mongodb+srv://root:root@cluster0.rkruo.mongodb.net/node_dart_game?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.listen(port, () => console.log(`Port sur écoute : ${port}`));

// const getNbPlayers = () => {
//     inquirer
//         .prompt([
//             {
//                 name: "gamemodes",
//                 type: "list",
//                 message: "Choisissez votre mode de jeu :",
//                 choices: ["301", "Tour du monde"]
//             },
//             {
//                 name: "number_players",
//                 type: "number",
//                 message: "Combien de joueurs participent ?"
//             }
//         ])
//         .then((answer) => {
//             if(answer.gamemodes) {
//                 console.log(`Jeu choisi : ${answer.gamemodes}`)
//             } if(!answer.number_players) {
//                 console.log("Un nombre est attendu")
//             } else {
//                 console.log(`Nombre de joueurs : ${answer.number_players}`)
//                 if (answer.gamemodes == "301") {
//                     let troiscentun = new trois_cent_un()
//                     troiscentun.getNbPlayers(answer.number_players)
//                     console.log("301 Nombre flechettes récupérées via super : " + troiscentun.nbDarts)
//                     console.log("Les "+ troiscentun.nbPlayers + " joueurs possèdent un score de " + troiscentun.score + " et "+ troiscentun.nbDarts +" fléchettes chacun")
//                     console.log(troiscentun.startGame())
//                 } else {
//                     console.log("NOPE")
//                 }
//             }
//         })
//         .catch(error => {
//             console.log(error)
//         })
// }

// getNbPlayers();

const db = require('./models')
db.sequelize.sync({force:true})