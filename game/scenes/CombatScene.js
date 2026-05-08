import { Scene, manager } from '@tialops/maki'
import EnemyView from "../system/combat/enemy/enemy_view.js"

export default class CombatScene extends Scene {
    init(data) {
        this.combatState = data.combatState;
        this.combatSystem = data.combatSystem;
    }

    preload() {
        super.preload()
        manager.preload(this)

        this.load.image('tree', 'vegetation/tree.png')
        this.load.spritesheet('lia', 'sprites/lia.png', { frameWidth: 32, frameHeight: 64 })

        for (let i = 0; i < this.combatState.enemyInstances.length; i++) {
            this.load.image(this.combatState.enemyInstances[i].id, "enemy/" + this.combatState.enemyInstances[i].id + ".png")
        }
    }

    create() {
        super.create()
        manager.create(this)

        this.createBackground();
        this.createCombatUI();

        this.createActors();

        this.combatSystem.startCombat();
    }

    createActors() {
        // Player
        this.playerContainer = this.add.container(this.sys.canvas.width / 4, this.sys.canvas.height / 2)

        this.playerContainer.add(this.add.sprite(0, 0, 'lia', 0))

        // Enemies
        this.enemiesContainer = this.add.container(this.sys.canvas.width / 1.5, this.sys.canvas.height / 2)

        let spriteSizes = []
        for (let i = 0; i < this.combatState.enemyInstances.length; i++) {
            let enemySprite = new EnemyView(
                this, 
                this.combatState.enemyInstances[i].id, 
                this.combatState.enemyInstances[i]
            )

            spriteSizes.push(enemySprite.getBounds().width)

            this.enemiesContainer.add(enemySprite)
        }

        let enemySpacing = 25
        let totalLength = spriteSizes.reduce((a, b) => a + b, 0) + (enemySpacing * (spriteSizes.length - 1))

        let index = 0;
        let nextPosition = -(totalLength / 2);
        this.enemiesContainer.each((enemy) => {
            enemy.setPosition(nextPosition, 0)

            nextPosition += (spriteSizes[index]) + enemySpacing
            index++;
        })

        // Creating the creatures 
        console.log(totalLength)
    }

    createBackground() {
        let numberOfTree = 30;

        for (let i = 0; i < numberOfTree; i++) {
            this.add.image(i * (this.sys.canvas.width / numberOfTree) + 25, this.sys.canvas.height / 4, 'tree').setScale(1.2, 1.2).setDepth(1)
        }

        // Creating the ground
        this.add.rectangle(this.sys.canvas.width / 2, (this.sys.canvas.height / 2) + 100, this.sys.canvas.width, this.sys.canvas.height / 1.3, 0x677c2b).setDepth(-1)
    }

    createCombatUI() {
        
    }

    update() {
        
    }
}
