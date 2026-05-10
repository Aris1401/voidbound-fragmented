import BaseEnemy from "../../../entities/enemy/base_enemy";
import BaseGoblinEncounterModel from "../../combat/encounter/base_goblin_encounter_model";

export default class GoblinEnemy extends BaseEnemy {
    constructor(scene, combatSystem) {
        super(scene, 'goblin', combatSystem)

        this.encounterModel = new BaseGoblinEncounterModel()
    }
}