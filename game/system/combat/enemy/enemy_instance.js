export default class EnemyInstance {
    constructor() {
        this.name = ""
        this.id = ""

        this.maxHP = 0
        this.currentHP = 0

        this.currentBlock = 0

        this.enemyModel = null
    }

    initializeStats() {
        this.maxHP = Math.floor(Math.random() * (this.enemyModel.maxHP - this.enemyModel.minHP) + this.enemyModel.minHP)
        this.currentHP = this.maxHP

        this.currentBlock = Math.floor(Math.random() * (this.enemyModel.maxBlock - this.enemyModel.minBlock) + this.enemyModel.minBlock)
    }
}