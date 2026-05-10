export default class EncounterModel {
    constructor() {
        this.enemies = []

        this.minMoneyReward = 5
        this.maxMoneyReward = 10

        this.maxCardReward = 3
        this.minCardReward = 0

        this.cardRewards = []
        this.moneyReward = 0
    }

    generateEncounter() {
        
    }

    generateRewards(cardDB) {
        let cardNumber = Math.floor(Math.random() * (this.maxCardReward - this.minCardReward) + this.minCardReward)
        
        for (let i = 0; i < cardNumber; i++) {
            this.cardRewards.push(new (cardDB.getRandom())())
        }

        this.moneyReward = Math.floor(Math.random() * (this.maxMoneyReward - this.minMoneyReward) + this.minMoneyReward) * (this.enemies.length + 1)
    }
}