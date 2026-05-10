import { Scene, manager } from '@tialops/maki'
import EnemyView from "../system/combat/enemy/enemy_view.js"
import CardPile from '../system/combat/card/card_pile.js';
import SlashCard from '../data/combat/card/slash_card.js';
import CardView from '../system/combat/card/card_view.js';
import CardModel from '../system/combat/card/card_model.js';
import EntityStats from '../system/combat/stats/entity_stats.js';
import CombatSystem from '../system/combat/combat_system.js';
import PlayerCombatState from '../system/combat/player/player_combat_state.js';

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

        // Loading combat ui
        this.load.image('draw_pile', 'combat/draw_pile.png')
        this.load.image('energy', 'combat/energy.png')
        this.load.image('enemy_selector', 'combat/enemy_selector.png')

        // Card ui
        this.load.image('card_base', 'card/base/card_base.png')
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
        this.singleTargetedEnemy = null
        this.enemiesContainer = this.add.container(this.sys.canvas.width / 1.5, this.sys.canvas.height / 2)

        let spriteSizes = []
        for (let i = 0; i < this.combatState.enemyInstances.length; i++) {
            let enemySprite = new EnemyView(
                this, 
                this.combatState.enemyInstances[i].id, 
                this.combatState.enemyInstances[i]
            )

            enemySprite.enemyInstance.enemyStats.statsEventEmitter.on(EntityStats.Events.DIED, () => {
                this.onEnemyDied(enemySprite)
            })

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

        // Enemy calls after position changes
        this.enemiesContainer.each((enemy) => {
            this.enemyInteraction(enemy)
            enemy.setupHealthBar(this.enemiesContainer.x, this.enemiesContainer.y)
        })

        // Creating the creatures 
        console.log(totalLength)
    }

    enemyInteraction(enemyView) {
        enemyView.setInteractive()

        enemyView.on('pointerover', () => {
            if (this.draggedCardView == null) return;

            this.tweens.add({
                targets: this.enemySelector,
                x: this.enemiesContainer.x + enemyView.x,
                y: this.enemiesContainer.y + enemyView.y - enemyView.getBounds().height - 10,
                alpha: 1,
                ease: 'Power1',
                duration: 250
            })

            this.singleTargetedEnemy = enemyView
        })

        enemyView.on('pointerout', () => {
            this.singleTargetedEnemy = null

            this.tweens.add({
                targets: this.enemySelector,
                alpha: 0,
                ease: 'Power1',
                duration: 250
            })
        })
    }

    onEnemyDied(enemyView) {
        console.log(this.combatState)
        
        this.enemiesContainer.remove(enemyView)
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
        // Enemy selector
        this.enemySelector = this.add.image(300, 300, 'enemy_selector')
        this.enemySelector.setDepth(50).setAlpha(0)

        // The draw pile
        this.drawPileButton = this.add.container(100, this.sys.canvas.height / 1.5).setDepth(10)
        this.drawPileButton.add(this.add.image(0, 0, 'draw_pile'))

        this.drawPileText = this.add.text(0, 0, this.combatSystem.playerStats.playerCombatState.drawPile.cards.length)
        this.combatSystem.playerStats.playerCombatState.drawPile.events.on(CardPile.Events.PILE_CHANGED, (cards) => {
            this.drawPileText.setText(cards.length)
        })

        this.drawPileButton.add(this.drawPileText)

        // The card tooltip
        this.cardTooltip = this.add.container(0, 0)
        this.cardTooltipBg = this.add.rectangle(0, 0, 400, 400, 0x000000, 0.8).setDepth(20)
        this.cardTooltipText = this.add.text(0, 0, "Test", { wordWrap: { width: 200 } }).setAbove(this.cardTooltipBg)

        this.cardTooltip.add([this.cardTooltipBg, this.cardTooltipText]).setAlpha(0)

        // The player hand
        this.playerHand = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height - 100)
        this.combatSystem.playerStats.playerCombatState.hand.events.on(CardPile.Events.CARD_ADDED, (card) => {
            this.onCardAddedToHand(card)
        })

        this.combatSystem.playerStats.playerCombatState.hand.events.on(CardPile.Events.CARD_REMOVED, (card) => {
            this.playerHand.each((cardView) => {
                if (cardView.cardModel == card) cardView.destroy()
            })

            this.organizePlayerHand()
        })

        this.draggedCardView = null

        // The player energy
        this.energyContainer = this.add.container(this.drawPileButton.x, this.drawPileButton.y + 100)
        let energyImage = this.add.image(0, 0, 'energy').setDepth(20)
        this.energyContainer.add(energyImage)
        this.enemiesContainerText = this.add.text(0, 0, this.combatSystem.playerStats.maxEnergy).setDepth(21)

        this.energyContainer.add(this.enemiesContainerText)

        this.combatSystem.playerStats.playerCombatState.events.on(PlayerCombatState.Events.ENERGY_CHANGED, (currentEnergy, maxEnergy) => {
            this.enemiesContainerText.setText(currentEnergy)
        })
    }

    showCardTooltip(cardView) {
        this.cardTooltipText.setText(cardView.cardModel.getDescription())

        this.cardTooltipBg.setSize(this.cardTooltipText.displayWidth + 10, this,this.cardTooltipText.displayHeight + 10)

        this.add.tween({
            targets: this.cardTooltip,
            x: this.playerHand.x + cardView.x - (cardView.getBounds().width / 2),
            y: this.playerHand.y + cardView.y - cardView.getBounds().height - this.cardTooltipText.displayHeight,
            alpha: 1,
            ease: 'Power2',
            duration: 250
        })
    }

    hideCardTooltip() {
        this.add.tween({
            targets: this.cardTooltip,
            alpha: 0,
            ease: 'Power2',
            duration: 250
        })
    }

    onCardAddedToHand(card) {
        let cardView = new CardView(this)
        cardView.setupView(card)
        cardView.setDepth(15)
        // cardView.setScale(1.2)

        cardView.on('pointerdown', () => {
            this.onCardViewPressed(cardView)
        })

        cardView.on('pointerover', () => {
            this.onCardViewHover(cardView)
        })

        cardView.on('pointerout', () => {
            this.onCardViewUnhover(cardView)
        })

        this.input.on('pointerup', () => {
            this.onCardViewReleased(cardView)
        })

        this.playerHand.add(cardView)

        this.organizePlayerHand()
    }

    organizePlayerHand() {
        let cardSizes = []

        this.playerHand.each((cardView) => {
            cardSizes.push(cardView.getBounds().width)
        })

        console.log(cardSizes)

        let totalCardSizes = cardSizes.reduce((a, b) => a + b, 0)
        let spawnPosition = -(totalCardSizes / 2)
        let farthestAway = spawnPosition
        
        this.playerHand.each((cardView) => {
            this.tweens.add({
                targets: cardView,
                x: spawnPosition,
                 ease: 'Power1',
                duration: 250
            })
            
            spawnPosition += cardView.getBounds().width + 5
        })

        // Adjusting the rotation
        // let maxRotation = 35
        // let currentRotation = -maxRotation

        // let incrementalRotation = maxRotation / Math.floor(this.playerHand.length / 2)

        // this.playerHand.each((cardView) => {
        //     cardView.setRotation(Phaser.Math.DegToRad(currentRotation))
            
        //     currentRotation += incrementalRotation
        // })
    }

    // Card hover
    onCardViewHover(cardView) {
        if (cardView.cardState != CardView.CardState.NORMAL) return;

        cardView.cardState = CardView.CardState.HOVERED

        this.tweens.add({
            targets: cardView,
            y: cardView.y - 20,
            ease: 'Power2',
            duration: 250
        })

        this.showCardTooltip(cardView)
    }

    onCardViewUnhover(cardView) {
        if (cardView.cardState != CardView.CardState.HOVERED) return;

        cardView.cardState = CardView.CardState.NORMAL

        this.tweens.add({
            targets: cardView,
            y: 0,
            ease: 'Power2',
            duration: 250
        })

        this.hideCardTooltip()
    }

    onCardViewPressed(cardView) {
        if (cardView.cardState != CardView.CardState.NORMAL && cardView.cardState != CardView.CardState.HOVERED) return;

        this.hideCardTooltip()

        cardView.cardState = CardView.CardState.DRAGGED

        this.draggedCardView = cardView;

        cardView.lastXPosition = cardView.x
        cardView.lastYPosition = cardView.y
    }

    onCardViewReleased(cardView) {
        if (cardView.cardState != CardView.CardState.DRAGGED) return;

        // TODO: If the move is not valid
        if (cardView.y - (cardView.getBounds().height / 2) > 0) {
            // If the card is dropped and the bottom of the screen

            this.cancelCardDrag(cardView)
        } else {
            let playedCard = false
            this.draggedCardView = null

            let targets = []

            switch(cardView.cardModel.targeting) {
                case CardModel.TargetType.ALL:
                    break
                case CardModel.TargetType.MULTIPLE:
                    break
                case CardModel.TargetType.SINGLE:
                    if (this.singleTargetedEnemy != null) {
                        targets = [this.singleTargetedEnemy.enemyInstance.enemyStats]
                        playedCard = true
                        break
                    }
                case CardModel.TargetType.SELF:
                    break
            }

            // Remove the card form the hand pile
            if (playedCard) {
                if (cardView.cardModel.canPlay()) {
                    cardView.cardModel.onPlay(targets)
                    cardView.cardModel.afterPlay()
                    this.combatSystem.playerStats.playerCombatState.hand.remove(cardView.cardModel)
                } else {
                    this.cancelCardDrag(cardView)   
                }
            }
            else this.cancelCardDrag(cardView)
        }
    }
    
    cancelCardDrag(cardView) {
        cardView.cardState = CardView.CardState.NORMAL

        this.draggedCardView = null;
        
        this.tweens.add({
            targets: cardView,
            x: cardView.lastXPosition,
            y: 0,
            duration: 250,
            ease: 'Power2'
        })
    }

    update() {
        if (this.draggedCardView) {
            this.draggedCardView.setPosition(this.input.mousePointer.x - this.playerHand.x, this.input.mousePointer.y - this.playerHand.y)
        }
    }
}
