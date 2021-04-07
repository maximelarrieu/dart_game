const { request } = require('express')
const { nbPlayers } = require('../gamemode')
const GameMode = require('../gamemode')
const GamePlayer = require('../../models').GamePlayer
const Player = require('../../models').Player
const Game = require('../../models').Game
const GameShot = require('../../models').GameShot
// const { sequelize } = require('../../models');
// const sequelize = require('sequelize')
// let player = new GamePlayer
const GamePlayers = require("../../models/gameplayerschema")

class trois_cent_un extends GameMode {
    constructor(name = "301", score = 301, nbDarts, nbPlayers) {
        super(),
        this.name = name,
        this.score = score,
        this.randomize = this.randomize
    }

    // Fonction shot (chaque joueur y passe 3x)
    async shot(sector, multiplicator, gameplayer) {
        // Récupération du score total du GamePlayer
        let new_score = gameplayer.score - (sector * multiplicator)
        console.log(gameplayer.score)
        // Récupération du nombre de tirs restants au joueur
        let new_shots = gameplayer.remainingShots - 1
        // Retourne les nouvelles valeurs
        const results = {new_score: new_score, new_shots: new_shots}
        return results
    }

    async checkScore(gameplayer, score) {
        if(score ===  0) {
            return "0"
        } else if (score < 0) {
            return "fail"
        }
    }

    async checkFinish(gameplayers) {
        console.log(gameplayers)
        gameplayers.map((index) => {
            console.log(index.score)
            if (index.score === 0) {
                console.log("ok")
                return "finished"
            }
        })
    }

    randomize(gameId, currentPlayerId) {
        console.log("alloo")
        return GamePlayer.findAll({
            where: {
                gameId: gameId,
                inGame: true
            }
        })
        .then((gp) => {
            let all = gp.map((i) => i.playerId)
            let rand = Math.floor(Math.random() * all.length)
            let new_player = all[rand]
            if(new_player == currentPlayerId) {
                this.randomize(gameId, currentPlayerId)
            } else {
                return new_player
            }
        })
    }
    

    // fucntion end
    // endGame(winner) {
    //     console.log(`${winner} a gagné !`)
    // }
    // ....
    // checkDarts(current) {
    //     GamePlayer.findAll({
    //         where: {
    //             gameId: id
    //         }
    //     })
    //     })
    //     .then((gp) => {
    //         console.log("Tous les joueurs récupérés")
    //         console.log(gp)
    //         let all = gp.map((i) => i.playerId)
    //         console.log(all)
    //         let rand = Math.floor(Math.random() * all.length)
    //         let new_current = all[rand]
    //         Game.update(
    //         {
    //             currentPlayerId: new_current
    //         },
    //         {
    //             where: {id: id}
    //         },)
    //         GamePlayer.update({
    //             remainingShots: 3
    //         },
    //         {
    //             where: {
    //                 id: currentplayer,
    //                 remainingShots: 0
    //             }
    //         })
    //     })
    // }
    
}
module.exports = new trois_cent_un()