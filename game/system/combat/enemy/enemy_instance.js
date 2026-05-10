import EnemyStats from "../../../data/combat/stats/enemy/enemy_stats";

export default class EnemyInstance {
    constructor() {
        this.name = ""
        this.id = ""

        this.enemyStats = null;

        this.enemyModel = null
    }

    initializeStats() {
        this.enemyStats = new EnemyStats();

        this.enemyStats.maxHp = Math.floor(Math.random() * (this.enemyModel.maxHP - this.enemyModel.minHP) + this.enemyModel.minHP)
        this.enemyStats.hp = this.enemyStats.maxHp

        this.enemyStats.block = Math.floor(Math.random() * (this.enemyModel.maxBlock - this.enemyModel.minBlock) + this.enemyModel.minBlock)
    }
}