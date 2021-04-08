class GameMode {
    constructor(name, nbPlayers, nbDarts = 3) {
        this.name = name,
        this.nbPlayers = nbPlayers
        this.nbDarts = nbDarts
    }

    // Fonction d'initialisation d'une game lorsqu'un joueur est ajouté
    async startGame(gameplayers) {
        const ids = []
        gameplayers.map((index) => {
            if(index.playerId) {
                ids.push(index.playerId)
            } else {
                ids.push(index)
            }
        })
        let rand = Math.floor(Math.random() * ids.length)
        let current_player = ids[rand]
        return current_player
    }

    // Fonction de changement de joueur dans l'ordre
    // Déduire l'ordre ici ?
    async setOrder(gameplayers, current) {
        const order = []
        gameplayers.map((index) => {
            order.push(JSON.stringify(index.playerId))
        })
        const actual = order.indexOf(current)
        if(actual >= 0 && actual < order.length) {
            const next = order[actual + 1]
            if (next === undefined) {
                const next = order[0]
                return next
            } else {
                return next
            }
        }
    }

    getNbPlayers(input) {
        this.nbPlayers = input
        console.log('GAMEMODE Nombre de joueurs définis à : ' + this.nbPlayers)
        return this.nbPlayers
    }
}

module.exports = GameMode
