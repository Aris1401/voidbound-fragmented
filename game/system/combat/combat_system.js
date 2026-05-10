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
        if (this.combatState.enemyInstances > 0) return;

        this.events.emit(CombatSystem.Events.COMBAT_WON)
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
            console.log("Enemy's turn")
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

    endPlayerTurn() {
        if (this.currentTurnSide != CombatSystem.Side.PLAYERS) return;

        this.switchTurn()
        
        this.events.emit(CombatSystem.Events.PLAYER_TURN_ENDED, this.combatState)

        this.startTurn()
    }
}