import { manager, Scene } from "@tialops/maki"
import GameScene from "../GameScene.js"

export default class MainMenuScene extends Scene {
    preload() {
        super.preload()
        manager.preload(this)

        if (!this.scene.get('game')) {
            this.scene.add('game', GameScene, false)
        }
    }

    create() {
        super.create()
        manager.create(this)
        let title = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'Voidbound: Fragmented', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5)

        // Start indicator for the game scene
        this.add.text(title.x, title.y + 100, 'Press on any key to start...', { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5)
    }

    update() {
        this.input.keyboard.on('keydown', () => {
            this.scene.start('game')
        })
    }
}