const { nbPlayers } = require('../gamemode')
const GameMode = require('../gamemode')

class trois_cent_un extends GameMode {
    
    constructor(name = "301", score = 301, nbPlayers, nbDarts) {
        super(nbDarts, nbPlayers),
        this.name = name,
        this.score = score
    }

    static getNbPlayers() {
        return super.getNbPlayers()
    }

    // function start
    static startGame() {
        return super.startGame()
        // Chaque joueur récupéré a 301 points
        // Chaque joueur lance 3(nbDarts) fleches -> (1 fleche -> entre 1 et 20 x1 x2 ou x3 MAIS AUSSI 25 x2)
    }
   

    // function shot (chaque joueur y passe 3x)
    // static shot() {
        // Chaque score de chaque fleche baisse les points
        // si points = 0 -> function end
    // }
    

    // fucntion end
    static endGame() {
        if(score == 0) {
            console.log("La partie est terminé")
            //propose de restart
            //propose un autre gamemode
        }
    }
    // ....
}

module.exports = trois_cent_un