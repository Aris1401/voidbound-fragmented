import EncounterModel from "../../../system/combat/encounter/encounter_model";
import GoblinEnemyModel from "../enemy/goblin_enemy_model";

export default class BaseGoblinEncounterModel extends EncounterModel{
    generateEncounter() {
        var number = Math.floor(Math.random() * (2 - 3)) + 2

        for (let i = 0; i < number; i++) {
            this.enemies.push(new GoblinEnemyModel())
        }
    }
}