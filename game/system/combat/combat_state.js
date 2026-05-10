import EnemyInstance from "./enemy/enemy_instance"
import EntityStats from "./stats/entity_stats";

export default class CombatState {
    constructor() {
        this.enemyInstances = []
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
    }

    removeEnemy(enemyInstance) {
        let enemyIndex = this.enemyInstances.indexOf(enemyInstance)

        if (enemyIndex > -1) {
            this.enemyInstances.splice(enemyIndex, 1)
        }
    }
}