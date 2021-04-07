class GameMode {
    constructor(name, nbPlayers, nbDarts = 3) {
        this.name = name,
        this.nbPlayers = nbPlayers
        this.nbDarts = nbDarts
    }

    // Fonction d'initialisation d'une game lorsque un joueur est ajouté
    async startGame(gameplayers) {
        const ids = []
        gameplayers.map((index) => {
            ids.push(index.playerId)
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
        console.log(actual < order.length)
        if(actual >= 0 && actual < order.length) {
            const next = order[actual + 1]
            console.log(next)
            if (next === undefined) {
                const next = order[0]
                console.log(next)
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
