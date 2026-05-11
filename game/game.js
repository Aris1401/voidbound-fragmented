import Phaser from 'phaser'
import MainMenuScene from './scenes/Menus/MainMenuScene'
import DialogUI from './scenes/HUD/dialog_ui'

new Phaser.Game({
    type: Phaser.AUTO,
    width: 1024,
    height: 600,
    title: 'Voidbound Fragmented',
    backgroundColor: '#1a1a2e',
    mode: Phaser.Scale.RESIZE,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [MainMenuScene]
})
