import BaseSlimeEncounterModel from "../../data/combat/encounter/base_slime_encounter_model";
import CombatEncounter from "../../system/combat/combat_encounter";
import Entity from "../entity";

export default class BaseEnemy extends Entity {
    constructor(scene, name, combatSystem) {
        super(scene, name);

        this.playerOverlapped = false;

        this.combatSystem = combatSystem;
        this.encounterModel = new BaseSlimeEncounterModel();
    }

    onOverlapWithBody(body) {
        if (this.playerOverlapped) return;

        this.playerOverlapped = true;

        // Creating the combat encounter
        let combatEncounter = new CombatEncounter(this.scene, 3, this.encounterModel, this.combatSystem)
        combatEncounter.startCombat()
    }
}