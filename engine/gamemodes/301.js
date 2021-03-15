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


class trois_cent_un extends GameMode {
    
    constructor(name = "301", score = 301, nbDarts, nbPlayers) {
        super(),
        this.name = name,
        this.score = score,
        this.randomize = this.randomize
    }
    startGame(id) {
        return GamePlayer.findAll({
            where: {
                gameId: id,
                inGame: true
            },
            include: [
                {
                    model: Player
                }
            ],
            raw: true,
            nest: true
        })
        .then((players => {
            let player = players.map((p) => p.Player)
            console.log(player)
            let player_id = player.map((p) => p.id)
            console.log(player_id)
            let rand = Math.floor(Math.random() * player_id.length)
            let current_player = player_id[rand]
            console.log("cu : " + current_player)
            return current_player
        }))
    }

    randomize(gameId, currentPlayerId) {
        console.log("alloo")
        return GamePlayer.findAll({
            where: {gameId: gameId}
        })
        .then((gp) => {
            let all = gp.map((i) => i.playerId)
            let rand = Math.floor(Math.random() * all.length)
            let new_player = all[rand]
            if(new_player == currentPlayerId) {
                console.log(new_player)
                console.log(currentPlayerId)
                console.log(new_player == currentPlayerId)
                console.log("oupsi")
                this.randomize(gameId, currentPlayerId)
            } else {
                console.log("IN ELSE")
                console.log(new_player)
                console.log(currentPlayerId)
                return new_player
            }
        })

        // GamePlayer.findAll({
        //     where: {
        //         gameId: gameid
        //     }
        // })
        // .then((gp) => {
        //     let id = gp.map((i) => i)
        //     console.log(id)
        //     let index = id.indexOf(gameplayer)
        //     if (index >= 0 && index < id.length - 1) {
        //         let next = id[index + 1]
        //         return next
        //     }
            // return next
        // })
    }

    // function shot (chaque joueur y passe 3x)
    shot(id, sector, player) {
        console.log("reçu: " + player)
        // Récupération de la liste des joueurs de la partie
        GamePlayer.findAll({
            where: {
                gameId: id,
                playerId: player,
                inGame: true
            },
            include: [
                {
                    model: Player
                }
            ],
            raw: true,
            nest: true
        })
            // On passe l'object reçu
            .then(function (players) {
                console.log(players)
                // Récupèration du score total du GamePlayer
                let player_score = players.map((p) => p.score)
                // Récupération du nombre de tirs restants au joueur
                let player_shots = players.map((p) => p.remainingShots)
                // Update du GamePlayer
                GamePlayer.update({
                    // Soustraction du score total au sector reçu par la route
                    score: player_score - sector,
                    // On décrémente son nombre de tir
                    remainingShots: player_shots - 1,
                },
                {
                    where: {
                        playerId: player
                    }
                })
                .then(() => {
                    GameShot.create({
                        gameId: id,
                        sector: sector,
                        playerId: player
                    })
                    GamePlayer.findByPk(player, {})
                    .then((gp) => {
                        let score = gp.score
                        console.log("SCOOOOORE")
                        console.log(gp.score)
                        if (score == 0) {
                            console.log("WIIIIIIIIIIIIIIIIIN!")
                            GamePlayer.update({
                                inGame: false
                            },
                            {
                                where: {
                                    playerId: player
                                }
                            })
                        } else if (score < 0) {
                            console.log("COOOOOOOOOOOOOOOOOON")
                            GamePlayer.update({
                                score: score + sector
                            },
                            {
                                where: {
                                    playerId: player
                                }
                            })
                        }
                    })
                })

            })
            // console.log("end:" + result)
        // console.log(player)
        // for (let i in player) {
        //     console.log(player.gameId)
        // }
        // // Chaque score de chaque fleche baisse les points
        // let points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25]
        // let multi = [1, 2, 3]
        
        // const shoot = points[Math.floor(Math.random() * points.length)]
        // const multipli = multi[Math.floor(Math.random() * multi.length)]

        // for(let player = 1; player <= nbPlayers; player++) {
        //     console.log(`Joueur ${index} lance sa flèche`)
        //     for(let arrow = 1; arrow <= nbDarts; arrow++) {

                // player.score -= result
            // }
        //     if(player.score == 0) {
        //         this.endGame(player)
        //     }
        // }
        // si points = 0 -> function end
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