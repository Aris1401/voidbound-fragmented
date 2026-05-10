import EnemyStats from "../../../data/combat/stats/enemy/enemy_stats";

export default class EnemyInstance {
    static Events = {
        PERFORMED_MOVE: "performed_move"
    }

    constructor() {
        this.name = ""
        this.id = ""

        this.enemyStats = null;

        this.enemyModel = null

        this.events = new Phaser.Events.EventEmitter()
    }

    initializeStats() {
        this.enemyStats = new EnemyStats();

        this.enemyStats.maxHp = Math.floor(Math.random() * (this.enemyModel.maxHP - this.enemyModel.minHP) + this.enemyModel.minHP)
        this.enemyStats.hp = this.enemyStats.maxHp

        this.enemyStats.block = Math.floor(Math.random() * (this.enemyModel.maxBlock - this.enemyModel.minBlock) + this.enemyModel.minBlock)
    }

    async takeTurn(playerStats) {
        let animation = await this.enemyModel.executeMove(playerStats)
        this.events.emit(EnemyInstance.Events.PERFORMED_MOVE, animation)
        
        const listeners = this.events.listeners(EnemyInstance.Events.PERFORMED_MOVE)
        
        await Promise.all(listeners.map(listener => listener(animation)))
    }
}