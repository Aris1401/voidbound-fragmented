import EnemyInstance from "./enemy/enemy_instance"
import EntityStats from "./stats/entity_stats";

export default class CombatState {
    static Events = {
        ENEMIES_CHANGED: "enemies_changed"
    }

    constructor() {
        this.enemyInstances = []

        this.events = new Phaser.Events.EventEmitter()
    }

    createEnemy(enemyModel) {
        let enemyInstance = new EnemyInstance();
        enemyInstance.name = enemyModel.name;
        enemyInstance.id = enemyModel.id;
        enemyInstance.enemyModel = enemyModel;

        enemyInstance.initializeStats()

        return enemyInstance
    }

    addEnemy(enemyInstance) {
        this.enemyInstances.push(enemyInstance)

        enemyInstance.enemyStats.statsEventEmitter.on(EntityStats.Events.DIED, () => {
            this.removeEnemy(enemyInstance)
        })

        this.events.emit(CombatState.Events.ENEMIES_CHANGED, this.enemyInstances)
    }

    removeEnemy(enemyInstance) {
        let enemyIndex = this.enemyInstances.indexOf(enemyInstance)

        if (enemyIndex > -1) {
            this.enemyInstances.splice(enemyIndex, 1)
            this.events.emit(CombatState.Events.ENEMIES_CHANGED, this.enemyInstances)
        }
    }
}