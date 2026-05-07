export default class Entity extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, name) {
        super(scene, 0, 0, name);
        this.scene = scene;
        this.name = name;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    update() {}

    onCollideWithBody(body) {}

    onOverlapWithBody(body) {}
}