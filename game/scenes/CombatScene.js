import { Scene, manager } from '@tialops/maki'

export default class CombatScene extends Scene {
    preload() {
        super.preload()
        manager.preload(this)

        this.load.image('tree', 'assets/vegetation/tree.png')
    }

    create() {
        super.create()
        manager.create(this)

        this.createBackground();
    }

    createBackground() {
        let numberOfTree = 30;

        for (let i = 0; i < numberOfTree; i++) {
            this.add.image(i * (this.sys.canvas.width / numberOfTree) + 25, this.sys.canvas.height / 4, 'tree').setScale(1.2, 1.2).setDepth(1)
        }

        // Creating the ground
        this.add.rectangle(this.sys.canvas.width / 2, (this.sys.canvas.height / 2) + 100, this.sys.canvas.width, this.sys.canvas.height / 1.3, 0x677c2b).setDepth(0)
    }

    update() {
        
    }
}
