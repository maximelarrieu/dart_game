const GameMode = require('../gamemode')

class trois_cent_un extends GameMode {
    
    constructor(name = "301", nbPlayers, nbDarts) {
        super(nbDarts, nbPlayers),
        this.name = name
    }

    static getNbPlayers() {
        return super.getNbPlayers()
    }

    // function start
    // Chaque joueur récupéré a 301 points
    // Chaque joueur lance 3(nbDarts) fleches -> (1 fleche -> entre 1 et 20 x1 x2 ou x3 MAIS AUSSI 25 x2)
    
    // function shot (chaque joueur y passe 3x)
    // Chaque score de chaque fleche baisse les points
    // si points = 0 -> function end

    // fucntion end
    // ....
}

module.exports = trois_cent_un