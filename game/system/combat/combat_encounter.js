import CombatState from "./combat_state";

export default class CombatEncounter {
    constructor(scene, enemyNumber, encounterModel, combatSystem) {
        this.scene = scene;

        this.enemyNumber = enemyNumber;
        this.encounterModel = encounterModel;
        this.combatSystem = combatSystem;

        this.combatState = new CombatState();
        this.combatSystem.setCombatState(this.combatState);

        this.createEnemies()
    }

    createEnemies() {
        this.encounterModel.generateEncounter();
        this.encounterModel.generateRewards(this.combatSystem.cardDB)

        this.encounterModel.enemies.forEach(enemy => {
            let enemyInstance = this.combatState.createEnemy(enemy)
            this.combatState.addEnemy(enemyInstance)
        });
    }

    startCombat() {
        this.scene.scene.switch('combat', { combatState: this.combatState, combatSystem: this.combatSystem, encounterModel: this.encounterModel });
    }
}