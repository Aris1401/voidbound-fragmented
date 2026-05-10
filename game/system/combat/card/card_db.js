export default class CardDB {
    constructor() {
        this.cards = new Map()
    }

    register(cardClass) {
        this.cards.set(cardClass, cardClass)
    }

    get(cardClass) {
        return this.cards.get(cardClass)
    }

    getRandom() {
        let rndIdx = Math.floor(Math.random() * this.cards.size)
        let values = Array.from(this.cards.values())

        return values[rndIdx]
    }
}