const express = require('express')
const inquirer = require('inquirer')
const app = express();
const port = 3000

const GameMode = require('./engine/gamemode');
const trois_cent_un = require('./engine/gamemodes/301');
const GameMode301 = require('./engine/gamemodes/301')

const getNbPlayers = () => {
    inquirer
        .prompt([
            {
                name: "gamemodes",
                type: "list",
                message: "Choisissez votre mode de jeu :",
                choices: ["301", "Tour du monde"]
            },
            {
                name: "number_players",
                type: "number",
                message: "Combien de joueurs participent ?"
            }
        ])
        .then((answer) => {
            if(answer.gamemodes) {
                console.log(`Jeu choisi : ${answer.gamemodes}`)
            } if(!answer.number_players) {
                console.log("Un nombre est attendu")
            } else {
                console.log(`Nombre de joueurs : ${answer.number_players}`)
                GameMode.getNbPlayers(answer.number_players)
                if (answer.gamemodes == "301") {
                    const troiscentun = new trois_cent_un()
                    console.log("301 Nombre flechettes récupérées via super : " + troiscentun.nbDarts)
                    console.log("Les "+ trois_cent_un.nbPlayers + " joueurs possèdent un score de " + troiscentun.score + " et "+ troiscentun.nbDarts +" fléchettes chacun")
                    console.log(troiscentun.startGame())
                } else {
                    console.log("NOPE")
                }
            }
        })
        .catch(error => {
            console.log(error)
        })
}

getNbPlayers();