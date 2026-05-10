import BaseSlimeEncounterModel from "../../data/combat/encounter/base_slime_encounter_model";
import CombatEncounter from "../../system/combat/combat_encounter";
import CombatSystem from "../../system/combat/combat_system";
import Entity from "../entity";

export default class BaseEnemy extends Entity {
    constructor(scene, name, combatSystem) {
        super(scene, name);

        this.scene = scene

        this.playerOverlapped = false;

        this.combatSystem = combatSystem;
        this.encounterModel = new BaseSlimeEncounterModel();
    }

    onOverlapWithBody(body) {
        if (this.playerOverlapped) return;

        this.playerOverlapped = true;

        let combatEncounter = new CombatEncounter(this.scene, 3, this.encounterModel, this.combatSystem)
        
        this.combatSystem.events.once(CombatSystem.Events.COMBAT_WON, () => {
            this.destroy()
        })

        this.combatSystem.events.once(CombatSystem.Events.COMBAT_ENDED, () => {
            this.scene.time.addEvent({
                delay: 10000,
                callback: () => {
                    this.playerOverlapped = false;
                }
            })
        })
        
        combatEncounter.startCombat()
    }
}