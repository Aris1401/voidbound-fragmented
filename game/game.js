import Phaser from 'phaser'
import MainMenuScene from './scenes/Menus/MainMenuScene'

new Phaser.Game({
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    title: 'Voidbound Fragmented',
    backgroundColor: '#1a1a2e',
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [MainMenuScene]
})
