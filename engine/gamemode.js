class GameMode {
    constructor(name, nbPlayers, nbDarts = 3) {
        this.name = name,
        this.nbPlayers = nbPlayers,
        this.nbDarts = nbDarts
    }

    static getNbPlayers(input) {
        this.nbPlayers = input
        console.log('Nombre de joueurs définis à : ' + this.nbPlayers)
        return this.nbPlayers
    }
}

module.exports = GameMode
