import { Scene, manager } from '@tialops/maki'
import EnemyView from "../system/combat/enemy/enemy_view.js"
import CardPile from '../system/combat/card/card_pile.js';
import SlashCard from '../data/combat/card/slash_card.js';
import CardView from '../system/combat/card/card_view.js';
import CardModel from '../system/combat/card/card_model.js';
import EntityStats from '../system/combat/stats/entity_stats.js';
import CombatSystem from '../system/combat/combat_system.js';
import PlayerCombatState from '../system/combat/player/player_combat_state.js';
import GameScene from './GameScene.js';

export default class CombatScene extends Scene {
    init(data) {
        this.combatState = data.combatState;
        this.combatSystem = data.combatSystem;
        this.encounterModel = data.encounterModel;

        this.combatSystem.events.on(CombatSystem.Events.COMBAT_WON, () => {
            this.onCombatWon()
        })

        this.combatSystem.events.on(CombatSystem.Events.COMBAT_LOST, () => {
            this.onCombatLost()
        })

        this.input.keyboard.on('keydown-T', () => {
            this.combatSystem.playerStats.takeDamage(99999999999)
        })
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
        this.load.image('end_turn', 'combat/end_turn.png')

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

        this.createRewardUI()
        this.createGameOverUI()

        this.combatSystem.startCombat();
    }

    createActors() {
        // Player
        this.playerContainer = this.add.container(this.sys.canvas.width / 4, this.sys.canvas.height / 2)
        this.playerContainer.add(this.add.sprite(0, 0, 'lia', 0))

        // Creating the player health bar
        let barWidth = (this.combatSystem.playerStats.hp * 100) / this.combatSystem.playerStats.maxHp
        this.playerHealthBar = this.add.rectangle(0, 64, 100, 10, 0xff0000)
        this.playerHealthBarBg = this.add.rectangle(this.playerHealthBar.x, this.playerHealthBar.y, 100, 10, 0xffffff)

        this.playerContainer.add(this.playerHealthBarBg)
        this.playerContainer.add(this.playerHealthBar)

        this.playerHealthBar.width = barWidth

        this.combatSystem.playerStats.statsEventEmitter.on(EntityStats.Events.HEALTH_CHANGED, (data) => {
            this.tweens.add({
                targets: this.playerHealthBar,
                width: (data.currentHp * 100) / this.combatSystem.playerStats.maxHp,
                ease: 'Power1',
                duration: 250
            })
        })

        this.combatSystem.playerStats.statsEventEmitter.on(EntityStats.Events.TOOK_DAMAGE, (amount) => {
            this.cameras.main.shake(.2, amount)
        })

        // =========================== Enemies
        this.createEnemies()
    }

    createEnemies() {
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

        // Discard Pile
        this.discardPileButton = this.add.container(this.sys.canvas.width - 200, this.sys.canvas.height / 1.5).setDepth(10)
        this.discardPileButton.add(this.add.image(0, 0, 'draw_pile').setTint(0xff0000))

        this.discardPileText = this.add.text(0, 0, this.combatSystem.playerStats.playerCombatState.discardPile.cards.length)
        this.combatSystem.playerStats.playerCombatState.discardPile.events.on(CardPile.Events.PILE_CHANGED, (cards) => {
            this.discardPileText.setText(cards.length)
        })

        this.discardPileButton.add(this.discardPileText)

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

        // End turn
        this.createEndTurnButton()
    }

    createEndTurnButton() {
        this.endTurnButton = this.add.container(this.sys.canvas.width - 100, this.drawPileButton.y)
        let endTurnImage = this.add.image(0, 0, 'end_turn').setDepth(20)
        this.endTurnButton.add(endTurnImage)
        this.endTurnButton.add(this.add.text(0, 0, 'End turn').setDepth(21).setOrigin(.5))

        this.endTurnButton.setSize(endTurnImage.getBounds().width, endTurnImage.getBounds().height)

        this.endTurnButton.setInteractive()

        this.endTurnButton.on('pointerdown', () => {
            this.combatSystem.endPlayerTurn()
        })

        this.endTurnButton.on('pointerover', () => {
            this.tweens.add({
                targets: this.endTurnButton,
                scale: 1.1,
                ease: 'Power1',
                duration: 250
            })
        })

        this.endTurnButton.on('pointerout', () => {
            this.tweens.add({
                targets: this.endTurnButton,
                scale: 1,
                ease: 'Power1',
                duration: 250
            })
        })

        // Adding the combat system events
        this.combatSystem.events.on(CombatSystem.Events.PLAYER_TURN_ENDED, () => {
            this.tweens.add({
                targets: this.endTurnButton,
                alpha: 0,
                ease: 'Power1',
                duration: 100
            })
        })

        this.combatSystem.events.on(CombatSystem.Events.TURN_STARTED, (combatState) => {
            if (this.combatSystem.currentTurnSide == CombatSystem.Side.PLAYERS) {
                this.tweens.add({
                    targets: this.endTurnButton,
                    alpha: 1,
                    ease: 'Power1',
                    duration: 100
                })
            }
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
        this.organizeCardContainer(this.playerHand, 10)

        // Adjusting the rotation
        // let maxRotation = 35
        // let currentRotation = -maxRotation

        // let incrementalRotation = maxRotation / Math.floor(this.playerHand.length / 2)

        // this.playerHand.each((cardView) => {
        //     cardView.setRotation(Phaser.Math.DegToRad(currentRotation))
            
        //     currentRotation += incrementalRotation
        // })
    }

    organizeCardContainer(cardContainer, spacing = 5, maxWidth = null) {
        let cardSizes = []

        cardContainer.each((cardView) => {
            cardSizes.push(cardView.getBounds().width)
        })

        let totalCardSizes = cardSizes.reduce((a, b) => a + b, 0)

        // If maxWidth is provided, calculate dynamic spacing to fit within it
        let effectiveSpacing = spacing
        if (maxWidth !== null) {
            const cardCount = cardSizes.length
            // spacing slots = gaps between cards = cardCount - 1
            const totalSpacingNeeded = maxWidth - totalCardSizes
            effectiveSpacing = cardCount > 1 ? totalSpacingNeeded / (cardCount - 1) : 0
        }

        let totalWidth = totalCardSizes + effectiveSpacing * (cardSizes.length - 1)
        let spawnPosition = -(totalWidth / 2)

        cardContainer.each((cardView) => {
            this.tweens.add({
                targets: cardView,
                x: spawnPosition,
                ease: 'Power1',
                duration: 250
            })

            spawnPosition += cardView.getBounds().width + effectiveSpacing
        })
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

        cardView.cardState = CardView.CardState.NORMAL

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
                    targets = [this.combatSystem.playerStats]
                    playedCard = true
                    break
            }

            // Remove the card form the hand pile
            if (playedCard) {
                if (cardView.cardModel.canPlay(this.combatSystem)) {
                    cardView.cardModel.onPlay(targets)
                    cardView.cardModel.afterPlay()
                    this.combatSystem.playerStats.playerCombatState.hand.remove(cardView.cardModel)

                    this.combatSystem.playerStats.playerCombatState.discardPile.push(cardView.cardModel)
                    this.combatSystem.playerStats.playerCombatState.discardPile.shuffle()
                } else {
                    this.cancelCardDrag(cardView)   
                }
            }
            else this.cancelCardDrag(cardView)
        }
    }
    
    cancelCardDrag(cardView) {
        this.draggedCardView = null;
        
        this.tweens.add({
            targets: cardView,
            x: cardView.lastXPosition,
            y: 0,
            duration: 250,
            ease: 'Power2'
        })
    }

    createRewardUI() {
        this.rewardUI = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height / 2)

        // Popup title
        let rewardBg = this.add.rectangle(0, 0, 400, 500, 0x000000, .8)
        let rewardText = this.add.text(0, -(rewardBg.getBounds().height / 2) + 30, 'Rewards', { fontSize: '24px' }).setAbove(rewardBg).setOrigin(0.5)

        // Card container
        let rewardCardContainer = this.add.container(0, 0)
        
        console.log("dsfsdfdsf")
        console.log(this.encounterModel.cardRewards)
        console.log("dsfsdfdsf")

        this.encounterModel.cardRewards.forEach((card) => {
            let cardView = new CardView(this)
            cardView.setupView(card)
            cardView.setAbove(rewardBg)

            rewardCardContainer.add(cardView)
        })

        this.organizeCardContainer(rewardCardContainer, -10)

        // Cashout
        this.rewardButton = this.add.container(0, (rewardBg.getBounds().height / 2) - 50)
        let rewardButtonBg = this.add.image(0, 0, 'end_turn').setAbove(rewardBg).setScale(1.2)
        this.rewardButton.add(rewardButtonBg)
        this.rewardButton.add(this.add.text(0, 0, `Cashout: ${ this.encounterModel.moneyReward }$`).setOrigin(0.5))

        this.rewardButton.setSize(rewardButtonBg.getBounds().width, rewardButtonBg.getBounds().height)
        this.rewardButton.setInteractive()

        this.rewardButton.on('pointerover', () => {
            this.tweens.add({
                targets: this.rewardButton,
                scale: 1.1,
                ease: 'Power1',
                duration: 250
            })
        })

        this.rewardButton.on('pointerout', () => {
            this.tweens.add({
                targets: this.rewardButton,
                scale: 1,
                ease: 'Power1',
                duration: 250
            })
        })

        this.rewardButton.on('pointerdown', () => {
            this.onCashoutReward()
        })

        this.rewardUI.add(rewardBg).setDepth(25)
        this.rewardUI.add(rewardText)
        this.rewardUI.add(rewardCardContainer)
        this.rewardUI.add(this.rewardButton)

        this.rewardUI.visible = false
        this.canCashout = false
    }

    showRewardUI() {
        this.rewardUI.visible = true

        this.tweens.add({
            targets: this.rewardUI,
            alpha: { from: 0, to: 1 },
            y: { from: (this.sys.canvas.height / 2) - 100, to: this.sys.canvas.height / 2 },
            ease: 'Power2',
            duration: 250
        })
    }

    createGameOverUI() {
        this.gameOverUI = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height / 2)

        // Popup title
        let gameOverBg = this.add.rectangle(0, 0, 400, 200, 0x000000, .8)
        let gameOverText = this.add.text(0, -(gameOverBg.getBounds().height / 2) + 30, 'You lose!', { fontSize: '24px' }).setAbove(gameOverBg).setOrigin(0.5)

        // Cashout
        this.gameOverButton = this.add.container(0, (gameOverBg.getBounds().height / 2) - 50)
        let gameOverButtonBg = this.add.image(0, 0, 'end_turn').setAbove(gameOverBg).setScale(1.2)
        this.gameOverButton.add(gameOverButtonBg)
        this.gameOverButton.add(this.add.text(0, 0, `Flee`).setOrigin(0.5))

        this.gameOverButton.setSize(gameOverButtonBg.getBounds().width, gameOverButtonBg.getBounds().height)
        this.gameOverButton.setInteractive()

        this.gameOverButton.on('pointerover', () => {
            this.tweens.add({
                targets: this.gameOverButton,
                scale: 1.1,
                ease: 'Power1',
                duration: 250
            })
        })

        this.gameOverButton.on('pointerout', () => {
            this.tweens.add({
                targets: this.gameOverButton,
                scale: 1,
                ease: 'Power1',
                duration: 250
            })
        })

        this.gameOverButton.on('pointerdown', () => {
            this.onFlee()
        })

        this.gameOverUI.add(gameOverBg).setDepth(25)
        this.gameOverUI.add(gameOverText)
        this.gameOverUI.add(this.gameOverButton)

        this.gameOverUI.visible = false
        this.canFlee = false
    }

    showGameOverUI() {
        this.gameOverUI.visible = true

        this.tweens.add({
            targets: this.gameOverUI,
            alpha: { from: 0, to: 1 },
            y: { from: (this.sys.canvas.height / 2) - 100, to: this.sys.canvas.height / 2 },
            ease: 'Power2',
            duration: 250
        })
    }

    onCombatWon() {
        this.canCashout = true

        this.showRewardUI()
    }

    onCombatLost() {
        this.canFlee = true;

        this.showGameOverUI()
    }

    onCashoutReward() {
        if (!this.canCashout) return;

        this.combatSystem.playerStats.gainCurrency(this.encounterModel.moneyReward)

        this.encounterModel.cardRewards.forEach((cardModel) => {
            this.combatSystem.playerStats.deck.push(cardModel)
        })

        this.scene.stop()
        this.scene.switch('game')
    }

    onFlee() {
        if (!this.canFlee) return;

        this.scene.stop()
        this.scene.switch('game')
    }

    update() {
        if (this.draggedCardView) {
            this.draggedCardView.setPosition(this.input.mousePointer.x - this.playerHand.x, this.input.mousePointer.y - this.playerHand.y)
        }
    }
}
