export default class CombatSystem {
    constructor() {
        this.playerStats = null;
        this.combatState = null; 
    }

    setPlayerStats(playerStats) {
        this.playerStats = playerStats;
    }

    setCombatState(combatState) {
        this.combatState = combatState;

        this.playerStats.setupCombat()
    }

    startCombat() {
        // TODO: Start the turn system

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