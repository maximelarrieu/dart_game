const GameMode = require('../gamemode')

class around_the_world extends GameMode {
    constructor(name = "around-the-world", score = 0, nbDarts, nbPlayers) {
        super(),
        this.name = name,
        this.score = score
    }
    // Fonction d'initialisation d'une game lorsque un joueur est ajouté
    async startGame(id) {
        const gameplayers = await GamePlayers.find({gameId: id})
        let players = gameplayers.map((p) => p.playerId)
        let players_id = players.map((p) => p._id)
        let rand = Math.floor(Math.random() * players_id.length)
        let current_player = players_id[rand]
        return current_player
    }

    async ifNext(sector, player_score) {
        if(sector === player_score + 1) {
            console.log('TRUE')
        } else {
            console.log("False")
        }
    }
}

module.exports = new around_the_world()