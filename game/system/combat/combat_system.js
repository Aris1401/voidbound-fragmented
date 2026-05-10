import CombatState from "./combat_state";

export default class CombatSystem {
    static Side = {
        PLAYERS: 0,
        ENEMYS: 1
    }

    static Events = {
        ENEMIES_CHANGED: "enemies_changed",
        COMBAT_WON: "combat_won",
        TURN_ENDED: "turn_ended",
        TURN_STARTED: "turn_started",
        PLAYER_TURN_ENDED: "player_turn_ended"
    }

    constructor() {
        this.playerStats = null;
        this.combatState = null; 

        this.currentTurnSide = CombatSystem.Side.PLAYERS

        this.cardDB = null

        this.events = new Phaser.Events.EventEmitter();
    }

    setPlayerStats(playerStats) {
        this.playerStats = playerStats;
    }

    setCombatState(combatState) {
        this.combatState = combatState;

        this.combatState.events.on(CombatState.Events.ENEMIES_CHANGED, (enemyInstances) => {
            this.checkWinCondition()

            this.events.emit(CombatSystem.Events.ENEMIES_CHANGED, enemyInstances)
        })

        this.playerStats.setupCombat()
    }

    checkWinCondition() {
        if (this.combatState.enemyInstances.length > 0) return;

        this.events.emit(CombatSystem.Events.COMBAT_WON)

        console.log("Combat Won")
    }

    startCombat() {
        // TODO: Start the turn system
        this.startTurn()
    }

    startTurn() {
        if (this.currentTurnSide == CombatSystem.Side.PLAYERS) {
            this.setupPlayerTurn()
        } else {
            // The enemy's turns
            this.setupEnemyTurn()
        }

        this.events.emit(CombatSystem.Events.TURN_STARTED, this.combatState)
    }

    switchTurn() {
        if (this.currentTurnSide == CombatSystem.Side.PLAYERS) {
            this.currentTurnSide = CombatSystem.Side.ENEMYS
        } else {
            this.currentTurnSide = CombatSystem.Side.PLAYERS
        }

        this.events.emit(CombatSystem.Events.TURN_ENDED, this.combatState)
    }
    
    setupPlayerTurn() {
        this.playerStats.playerCombatState.gainMaxEnergy()

        if (this.playerStats.playerCombatState.drawPile.size() <= 0) {
            let cardFromDiscard = this.playerStats.playerCombatState.discardPile.popFront()
            while (cardFromDiscard) {
                this.playerStats.playerCombatState.drawPile.push(cardFromDiscard)
                cardFromDiscard = this.playerStats.playerCombatState.discardPile.popFront()

                if (cardFromDiscard == undefined) break;
            } 

            this.playerStats.playerCombatState.drawPile.shuffle()
        }

        console.log(this.playerStats.playerCombatState.hand)

        let cardFromDraw = this.playerStats.playerCombatState.drawPile.popFront()
        let handAvailable = this.playerStats.playerCombatState.hand.push(cardFromDraw)
        if (!handAvailable) this.playerStats.playerCombatState.drawPile.push(cardFromDraw)
    
        this.playerStats.playerCombatState.drawPile.shuffle()
        while (handAvailable) {
            cardFromDraw = this.playerStats.playerCombatState.drawPile.popFront()
            handAvailable = this.playerStats.playerCombatState.hand.push(cardFromDraw)
    
            this.playerStats.playerCombatState.drawPile.shuffle()
            if (!handAvailable) {
                this.playerStats.playerCombatState.drawPile.push(cardFromDraw)
                break;
            }
        }

    }

    async setupEnemyTurn() {
        for (const enemy of this.combatState.enemyInstances) {
            await enemy.takeTurn(this.playerStats);
        }

        this.endEnemyTurn()
    }

    endEnemyTurn() {
        if (this.currentTurnSide != CombatSystem.Side.ENEMYS) return;

        this.switchTurn()

        this.startTurn()
    }

    endPlayerTurn() {
        if (this.currentTurnSide != CombatSystem.Side.PLAYERS) return;

        this.switchTurn()
        
        this.events.emit(CombatSystem.Events.PLAYER_TURN_ENDED, this.combatState)

        this.startTurn()
    }
}