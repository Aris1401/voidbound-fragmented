import { manager, Scene } from "@tialops/maki"
import GameScene from "../GameScene.js"

export default class MainMenuScene extends Scene {
    preload() {
        super.preload()
        manager.preload(this)

        if (!this.scene.get('GameScene')) {
            this.scene.add('GameScene', GameScene, false)
        }
    }

    create() {
        super.create()
        manager.create(this)
        this.add.text(400, 200, 'Voidbound: Fragmented', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5)

        // Start indicator for the game scene
        this.add.text(400, 300, 'Cliquez n\'importe quelle touche pour jouer...', { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5)
    }

    update() {
        this.input.keyboard.on('keydown', () => {
            this.scene.start('GameScene')
        })
    }
}