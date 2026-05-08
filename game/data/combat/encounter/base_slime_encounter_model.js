import EncounterModel from "../../../system/combat/encounter/encounter_model";
import SlimeEnemyModel from "../enemy/slime_enemy_model";

export default class BaseSlimeEncounterModel extends EncounterModel{
    generateEncounter() {
        var number = Math.floor(Math.random() * 4) + 1

        for (let i = 0; i < number; i++) {
            this.enemies.push(new SlimeEnemyModel())
        }
    }
}