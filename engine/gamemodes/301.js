const GameMode = require('../gamemode')
const GamePlayer = require('../../models').GamePlayer

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

    async checkScore(score) {
        if(score ===  0) {
            return "0"
        } else if (score < 0) {
            return "fail"
        }
    }

    async checkFinish(gameplayers) {
        const scores = []
        if (gameplayers.length > 0) {
            gameplayers.map((index) => {
                scores.push(index.score)
            })
            console.log(scores)
            const result = scores.every((score) => {
                console.log(scores)
                return score === 0
            })
            return result
        }
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
}
module.exports = new trois_cent_un()