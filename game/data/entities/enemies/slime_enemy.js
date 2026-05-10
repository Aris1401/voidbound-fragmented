import BaseEnemy from "../../../entities/enemy/base_enemy";

export default class SlimeEnemy extends BaseEnemy {
    constructor(scene, combatSystem) {
        super(scene, 'slime', combatSystem)
    }
}