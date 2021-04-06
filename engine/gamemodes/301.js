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
    // Fonction d'initialisation d'une game lorsque un joueur est ajouté
    // async startGame(id) {
    //     const gameplayers = await GamePlayers.find({gameId: id})
    //     let players = gameplayers.map((p) => p.playerId)
    //     let players_id = players.map((p) => p._id)
    //     let rand = Math.floor(Math.random() * players_id.length)
    //     let current_player = players_id[rand]
    //     return current_player
    // }
    async startGame(gameplayers) {
        const ids = []
        gameplayers.map((index) => {
            console.log(index.playerId)
            ids.push(index.playerId)
        })
        let rand = Math.floor(Math.random() * ids.length)
        let current_player = ids[rand]
        return current_player
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
                //         GamePlayer.findByPk(player)
                //         .then((gp) => {
                //             let score = gp.score
                //             console.log("SCOOOOORE")
                //             console.log(gp.score)
                //             if (score == 0) {
                //                 console.log("WIIIIIIIIIIIIIIIIIN!")
                //                 GamePlayer.update({
                //                     inGame: false                                },
                //                 {
                //                     where: {
                //                         playerId: player
                //                     }
                //                 })
                //                 .then(() => {
                //                     trois_cent_un.randomize(gp.gameId, gp.id)
                //                 })
                //             } else if (score < 0) {
                //                 console.log("COOOOOOOOOOOOOOOOOON")
                //                 GamePlayer.update({
                //                     score: score + (sector * multiplicator)
                //                 },
                //                 {
                //                     where: {
                //                         playerId: player
                //                     }
                //                 })
                //             }
                //         })
                //     })
                    
                // })
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