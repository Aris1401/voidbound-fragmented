export default class EnemyView extends Phaser.GameObjects.Sprite {
    constructor(scene, name, enemyInstance) {
        super(scene, 0, 0, name)

        this.enemyInstance = enemyInstance;

        this.scene.add.existing(this);
    }

    preload() {
        this.scene.add.rectangle(this.x, this.y + this.getBounds().height + 10, 400, 40, 0xff0000)
    }

    die() {
        this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            ease: 'Power1',
            duration: 250
        })
    }
}