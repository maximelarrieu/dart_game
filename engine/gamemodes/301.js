const { nbPlayers } = require('../gamemode')
const GameMode = require('../gamemode')

class trois_cent_un extends GameMode {
    
    constructor(name = "301", score = 301, nbDarts, nbPlayers) {
        super(),
        this.name = name,
        this.score = score
    }

    // getNbDarts() {
    //     return this.nbDarts
    // }

    // function start
    startGame() {
        console.log("GO! : " + this.nbPlayers)
        // Chaque joueur récupéré a 301 points
        // Chaque joueur lance 3(nbDarts) fleches -> (1 fleche -> entre 1 et 20 x1 x2 ou x3 MAIS AUSSI 25 x2)
        this.shot()
    }
   

    // function shot (chaque joueur y passe 3x)
    shot() {
        // Chaque score de chaque fleche baisse les points
        let points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25]
        let multi = [1, 2, 3]
        
        const shoot = points[Math.floor(Math.random() * points.length)]
        const multipli = multi[Math.floor(Math.random() * multi.length)]

        for(let player = 1; player <= nbPlayers; player++) {
            console.log(`Joueur ${index} lance sa flèche`)
            for(let arrow = 1; arrow <= nbDarts; arrow++) {
                const result = shoot * multipli
                console.log(result)
                player.score -= result
            }
            if(player.score == 0) {
                this.endGame(player)
            }
        }
        // si points = 0 -> function end
    }
    

    // fucntion end
    endGame(winner) {
        console.log(`${winner} a gagné !`)
    }
    // ....
}

module.exports = new trois_cent_un()