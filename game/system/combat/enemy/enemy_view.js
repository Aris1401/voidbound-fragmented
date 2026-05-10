import EnemyStats from "../../../data/combat/stats/enemy/enemy_stats";
import EntityStats from "../stats/entity_stats";

export default class EnemyView extends Phaser.GameObjects.Sprite {
    constructor(scene, name, enemyInstance) {
        super(scene, 0, 0, name)

        this.enemyInstance = enemyInstance;

        this.scene.add.existing(this);
    }

    setupHealthBar(containerPositionX = 0, containerPositionY = 0) {
        this.redHealthBar = this.scene.add.rectangle(this.x + containerPositionX, containerPositionY + this.y + this.getBounds().height, 50, 10, 0xff0000).setDepth(20)
        this.bgHeathBar = this.scene.add.rectangle(this.x + containerPositionX, containerPositionY + this.y + this.getBounds().height, 50, 10, 0xffffff).setDepth(19)
        this.enemyInstance.enemyStats.statsEventEmitter.on(EntityStats.Events.HEALTH_CHANGED, (data) => {
            this.scene.tweens.add({
                targets: this.redHealthBar,
                width: (data.currentHp * 50) / this.enemyInstance.enemyStats.maxHp,
                ease: 'Power1',
                duration: 250
            })
        })

        this.enemyInstance.enemyStats.statsEventEmitter.on(EnemyStats.Events.DIED, () => {
            this.die()
        })
    }

    die() {
        this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            ease: 'Power1',
            duration: 250,
            onComplete: () => {
                this.redHealthBar.destroy()
                this.bgHeathBar.destroy()

                this.destroy(true)
            }
        })
    }
}