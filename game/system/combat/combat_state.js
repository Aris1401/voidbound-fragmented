import EnemyInstance from "./enemy/enemy_instance"

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
    }

    addEnemy(enemyInstance) {
        this.enemyInstances.push(enemyInstance)
    }
}