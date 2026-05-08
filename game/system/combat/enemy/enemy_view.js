export default class EnemyView extends Phaser.GameObjects.Sprite {
    constructor(scene, name, enemyInstance) {
        super(scene, 0, 0, name)

        this.enemyInstance = enemyInstance;

        this.scene.add.existing(this);
    }
}