const GameMode = require('../gamemode')

class around_the_world extends GameMode {
    constructor(name = "around-the-world", score = 0, nbDarts, nbPlayers) {
        super(),
        this.name = name,
        this.score = score
    }

    // Fonction de vérification, est ce que le secteur est celui attendu ? 
    async ifNext(sector, player_score) {
        if(sector == player_score + 1) {
            return true
        } else {
            return false
        }
    }

    // Fonction de vérification, est ce que le dernier tir est celui attendu
    async isLast(sector, player_score) {
        if (sector == player_score + 5) {
            return true
        } else {
            return false
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
                return score === 25
            })
            return result
        }
    }
}

module.exports = new around_the_world()