import CombatState from "./combat_state";

export default class CombatEncounter {
    constructor(scene, enemyNumber, encounterModel) {
        this.scene = scene;

        this.enemyNumber = enemyNumber;
        this.encounterModel = encounterModel;

        this.combatState = new CombatState();

        this.createEnemies()
    }

    createEnemies() {
        this.encounterModel.generateEncounter();

        this.encounterModel.enemies.forEach(enemy => {
            let enemyInstance = this.combatState.createEnemy(enemy)
            this.combatState.addEnemy(enemyInstance)
        });
    }

    startCombat() {
        this.scene.scene.switch('combat');
    }
}