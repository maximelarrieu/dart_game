const { request } = require('express')
const { nbPlayers } = require('../gamemode')
const GameMode = require('../gamemode')
const GamePlayer = require('../../models').GamePlayer
const Player = require('../../models').Player
// const { sequelize } = require('../../models');
// const sequelize = require('sequelize')
// let player = new GamePlayer


class trois_cent_un extends GameMode {
    
    constructor(name = "301", score = 301, nbDarts, nbPlayers) {
        super(),
        this.name = name,
        this.score = score
    }
    startGame() {
        console.log("GO! : " + this.nbPlayers)
        // Chaque joueur récupéré a 301 points
        // Chaque joueur lance 3(nbDarts) fleches -> (1 fleche -> entre 1 et 20 x1 x2 ou x3 MAIS AUSSI 25 x2)
        this.shot()
    }
   
    test(id, scoret, shots) {

    }

    // function shot (chaque joueur y passe 3x)
    shot(id, sector, test) {
        // Récupération de la liste des joueurs de la partie
        GamePlayer.findAll({
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
            // On passe l'object reçu
            .then(function (players) {
                console.log(players)
                // Récupération de l'id du GamePlayer reçu
                let player_id = players.map((p) => p.id)
                // Récupèration du score total du GamePlayer
                let player_score = players.map((p) => p.score)
                // Récupération du nombre de tirs restants au joueur
                let player_shots = players.map((p) => p.remainingShots)

                let player = players.map((p) => p.playerId)

                test = player
                console.log(test)
                const result = test
                console.log(result)
                // Update du GamePlayer
                GamePlayer.update({
                    // Soustraction du score total au sector reçu par la route
                    score: player_score - sector,
                    // On décrémente son nombre de tir
                    remainingShots: player_shots - 1,
                },
                {
                    where: {
                        id: player_id
                    }
                })


                    // Alors
                    .then(function () {
                        // Si un joueur ayant 0 de score est trouvé. Le inGame passe à false
                        GamePlayer.update({
                            inGame: false
                        },
                        {
                            where: {
                                id: player_id,
                                score: 0
                            }
                        })
                        // player.update({
                        //     score: score - scoret,
                        // })
                        // .then(function (after) {
                            console.log("test-------------")
                            console.log(player)
                            
                        // })
                    })
                    console.log("fin:" + result)
                    return test
                    
            })
            // console.log("end:" + result)
            return test
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
}

module.exports = new trois_cent_un()