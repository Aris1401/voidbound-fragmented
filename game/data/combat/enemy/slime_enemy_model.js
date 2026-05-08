import EnemyModel from "../../../system/combat/enemy/enemy_model";

export default class SlimeEnemyModel extends EnemyModel {
    constructor() {
        super();

        this.id = "slime";
        this.name = "Slime";
        this.maxHP = 10;
        this.maxBlock = 0;
    }
}