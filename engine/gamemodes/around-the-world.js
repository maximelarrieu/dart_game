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
}

module.exports = new around_the_world()