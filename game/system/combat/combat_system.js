import CombatState from "./combat_state";

export default class CombatSystem {
    static Events = {
        ENEMIES_CHANGED: "enemies_changed",
        COMBAT_WON: "combat_won"
    }

    constructor() {
        this.playerStats = null;
        this.combatState = null; 

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
        this.setupPlayerTurn()
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
}